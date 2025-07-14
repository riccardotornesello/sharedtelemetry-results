"use client"

import { useField, TextInput } from "@payloadcms/ui"
import { TextFieldClientComponent } from "payload"
import styles from "./color-picker.module.css"

const ColorPicker: TextFieldClientComponent = ({
  field: { label, required = false },
  path,
}) => {
  const { value, setValue } = useField<string>({ path })

  return (
    <div className={styles.colorPicker}>
      <label className={"field-label"}>
        {label?.toString()} {required && <span className="required">*</span>}
      </label>
      <div className={styles.colorPickerRow}>
        <input
          type="color"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <TextInput
          label=""
          path={path}
          onChange={(e: { target: { value: string } }) =>
            setValue(e.target.value)
          }
          value={value}
        />
      </div>
    </div>
  )
}

export default ColorPicker
