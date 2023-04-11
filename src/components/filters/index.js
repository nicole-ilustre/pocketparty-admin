import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";

import Filter from "./filter";

const getFiltersWithMeta = (filters) =>
  filters.map((filter) => ({
    label: filter,
    hasChanged: false,
  }));

function Filters({ filters, onSave }) {
  const [renderedFilters, setRenderedFilters] = useState(
    getFiltersWithMeta(filters)
  );

  const onMove = useCallback(
    (idx, movement) => {
      let targetIdx;
      if (movement === "up") {
        targetIdx = idx - 1;
      } else {
        targetIdx = idx + 1;
      }

      if (targetIdx < 0 || targetIdx >= renderedFilters.length) {
        return;
      }

      const newRenderedFilters = [...renderedFilters];

      newRenderedFilters[targetIdx] = {
        ...renderedFilters[idx],
        hasChanged: true,
      };
      newRenderedFilters[idx] = {
        ...renderedFilters[targetIdx],
        hasChanged: true,
      };

      setRenderedFilters(newRenderedFilters);
    },
    [renderedFilters]
  );

  const onSubmit = () => {
    onSave(renderedFilters.map(({ label }) => label));
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 560 }}>
      <List>
        {renderedFilters.map((filter, idx) => (
          <Filter
            key={idx}
            text={filter.label}
            index={idx}
            hasChanged={filter.hasChanged}
            onMove={(movement) => onMove(idx, movement)}
          />
        ))}
      </List>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          sx={{ marginLeft: "8px" }}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default Filters;
