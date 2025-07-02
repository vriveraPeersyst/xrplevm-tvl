import { useEffect, useRef, useState } from "react";
import type { Row } from "../types";
import { PriceController } from "../services/priceController";
import { loadRows } from "../services/tvl";

export function useRows() {
  const [rows, set] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const priceController = useRef(new PriceController());

  useEffect(() => {
    // Load prices first
    priceController.current
      .load()
      .then(() => {
        loadRows(async (sym: string) =>
          priceController.current.getPrice(sym)
        ).then((r) => {
          set(r);
          setLoading(false);
        });
      })
      .catch((e) => {
        console.error("[useRows] Error loading prices:", e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const total = rows.reduce((s, r) => s + r.valueUsd, 0);
  return { rows, total, loading };
}
