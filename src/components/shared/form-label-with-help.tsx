"use client";

import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

interface FormLabelWithHelpProps {
  label: string;
  help: string;
}

export function FormLabelWithHelp({ label, help }: FormLabelWithHelpProps) {
  return (
    <span className="field-help-label">
      <span>{label}</span>
      <Tooltip title={help}>
        <QuestionCircleOutlined className="field-help-icon" tabIndex={0} />
      </Tooltip>
    </span>
  );
}
