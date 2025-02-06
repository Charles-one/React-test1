import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import './index.css';

const { Option } = Select;

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const handleChange = (value) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      defaultValue={i18n.language}
      style={{ width: 100 }}
      onChange={handleChange}
      className="language-switch"
      popupClassName="language-switch"
    >
      <Option value="zh">中文</Option>
      <Option value="en">English</Option>
    </Select>
  );
};

export default LanguageSwitch;
