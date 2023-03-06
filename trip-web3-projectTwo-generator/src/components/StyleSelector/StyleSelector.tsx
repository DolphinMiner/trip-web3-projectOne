import { Style } from "@/src/types";
import styles from "./StyleSelector.module.css";

export type StyleSelectorProps = {
  value: Style;
  onChange: (value: Style) => void;
  onClear: () => void;
  options: Array<{
    text: string;
    value: Style;
    disabled?: boolean;
  }>;
};
function StyleSelector({
  value,
  onChange,
  onClear,
  options,
}: StyleSelectorProps) {
  return (
    <div className={styles.selector}>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        <option disabled selected value="">
          -- select an option --
        </option>
        {options.map(({ text, value, disabled }) => (
          <option key={value} disabled={!!disabled} value={value}>
            {text}
          </option>
        ))}
      </select>
      {value ? (
        <div
          className={styles.clear}
          onClick={() => {
            onClear();
          }}
        >
          x
        </div>
      ) : null}
    </div>
  );
}

export default StyleSelector;
