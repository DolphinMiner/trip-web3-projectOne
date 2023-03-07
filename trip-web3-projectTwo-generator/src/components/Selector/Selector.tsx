import { Style } from "@/src/types";
import classNames from "classnames";
import styles from "./Selector.module.css";

export type SelectorProps<T extends string | number | undefined> = {
  value: T;
  onSelect: (value: T) => void;
  onClear?: () => void;
  options: Array<{
    text: string;
    value: T;
    disabled?: boolean;
  }>;
  className?: string;
  usePresetOption?: boolean;
};
function StyleSelector<T extends string | number | undefined>({
  value,
  onSelect,
  onClear,
  options,
  className,
  usePresetOption = true,
}: SelectorProps<T>) {
  return (
    <div className={classNames([styles.selector, className])}>
      <select>
        {usePresetOption ? (
          <option disabled selected={value === undefined} value="">
            -- select an option --
          </option>
        ) : null}

        {options.map(({ text, value, disabled }) => (
          <option
            key={value}
            disabled={!!disabled}
            value={value}
            onClick={() => {
              onSelect(value);
            }}
          >
            {text}
          </option>
        ))}
      </select>

      {value !== undefined && onClear ? (
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
