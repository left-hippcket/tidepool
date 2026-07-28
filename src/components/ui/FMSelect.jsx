import React from 'react';
import Select from 'react-select';

export function FMSelect({
  value,
  onChange,
  options,
  placeholder = "선택",
  className = "",
  style = {},
  isDisabled = false,
  isSearchable = false,
  isMulti = false,
  noOptionsMessage = "검색 결과가 없습니다"
}) {
  // react-select 스타일 커스터마이징
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0.5rem',
      border: state.isFocused ? '1px solid #D1D5DB' : '1px solid #D1D5DB',
      backgroundColor: 'white',
      padding: '0.25rem',
      fontSize: '0.875rem',
      minHeight: '38px',
      boxShadow: 'none',
      transition: 'all 0.2s',
      cursor: 'pointer',
      '&:hover': {
        borderColor: '#9CA3AF',
      }
    }),
    valueContainer: (base) => ({
      ...base,
      gap: '0.25rem',
      padding: isMulti ? '0.25rem 0.5rem' : '0.25rem 0.5rem',
      cursor: 'text',
      flexWrap: 'wrap',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#EFF6FF',
      borderRadius: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      paddingLeft: '0.5rem',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#1D4ED8',
      fontSize: '0.875rem',
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',
      paddingRight: 0,
      paddingLeft: 0,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#93C5FD',
      cursor: 'pointer',
      borderRadius: '0 0.25rem 0.25rem 0',
      paddingLeft: '0.25rem',
      paddingRight: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        backgroundColor: '#DBEAFE',
        color: '#2563EB',
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#111827',
      fontSize: '0.875rem',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9CA3AF',
      fontSize: '0.875rem',
    }),
    input: (base) => ({
      ...base,
      color: 'inherit',
      margin: 0,
      padding: 0,
      fontSize: '0.875rem',
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
      cursor: 'pointer',
      '&:hover': {
        color: '#6B7280',
      }
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '0.5rem',
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
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginTop: '0.25rem',
      overflow: 'hidden',
      zIndex: 9999,
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
        ? '#F9FAFB'
        : 'white',
      color: state.isSelected ? '#1E40AF' : '#111827',
      cursor: 'pointer',
      transition: 'background-color 0.15s',
      '&:active': {
        backgroundColor: '#EFF6FF',
      }
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: '0.875rem',
      color: '#6B7280',
      padding: '0.5rem 0.75rem',
    }),
  };

  // value를 react-select 형식으로 변환
  const selectedValue = isMulti
    ? (Array.isArray(value) ? options.filter(opt => value.includes(opt.value)) : [])
    : options.find(opt => opt.value === value);

  const handleChange = (selected) => {
    if (isMulti) {
      onChange(selected ? selected.map(opt => opt.value) : []);
    } else {
      onChange(selected?.value);
    }
  };

  return (
    <div className={className} style={style}>
      <Select
        value={selectedValue || null}
        onChange={handleChange}
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        isClearable={isSearchable && !isMulti}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        isMulti={isMulti}
        openMenuOnClick={true}
        tabSelectsValue={!isSearchable}
        noOptionsMessage={() => noOptionsMessage}
        classNamePrefix="fm-select"
        components={{
          IndicatorSeparator: () => <div style={{ backgroundColor: '#E5E7EB', width: '1px', marginTop: '6px', marginBottom: '6px' }} />,
        }}
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={false}
      />
    </div>
  );
}
