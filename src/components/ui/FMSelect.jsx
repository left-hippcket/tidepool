import React from 'react';
import Select from 'react-select';

export function FMSelect({ value, onChange, options, placeholder = "선택", className = "", isDisabled = false }) {
  // react-select 스타일 커스터마이징
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0.5rem',
      border: state.isFocused ? '1px solid #D1D5DB' : '1px solid #D1D5DB',
      backgroundColor: 'white',
      padding: '0.125rem',
      fontSize: '0.875rem',
      minHeight: '38px',
      boxShadow: 'none',
      transition: 'border-color 0.2s',
      '&:hover': {
        borderColor: '#D1D5DB',
      }
    }),
    valueContainer: (base) => ({
      ...base,
      gap: '0.25rem',
      padding: '0.25rem 0.5rem',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#111827',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9CA3AF',
    }),
    input: (base) => ({
      ...base,
      color: 'inherit',
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: '#E5E7EB',
      marginTop: '0.375rem',
      marginBottom: '0.375rem',
      width: '1px',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '0.5rem',
      color: '#9CA3AF',
      '&:hover': {
        color: '#6B7280',
      }
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '0.25rem',
      color: '#9CA3AF',
      cursor: 'pointer',
      '&:hover': {
        color: '#6B7280',
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      marginTop: '0.25rem',
      overflow: 'hidden',
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      maxHeight: '240px',
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '0.875rem',
      padding: '0.5rem 0.75rem',
      backgroundColor: state.isSelected
        ? '#EFF6FF'
        : state.isFocused
        ? '#F3F4F6'
        : 'white',
      color: state.isSelected ? '#1D4ED8' : '#111827',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#EFF6FF',
      }
    }),
  };

  // value를 react-select 형식으로 변환
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={className}>
      <Select
        value={selectedOption || null}
        onChange={(option) => onChange(option?.value)}
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        isClearable
        isDisabled={isDisabled}
        isSearchable={false}
      />
    </div>
  );
}
