import React, { useState, useRef, useEffect } from 'react';

export function FMMultiSelect({ values = [], onChange, options, placeholder = "검색 & 선택", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // 선택된 옵션들
  const selectedOptions = options.filter(opt => values.includes(opt.value));

  // 검색 필터링된 옵션들
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !values.includes(opt.value)
  );

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (optionValue) => {
    if (values.includes(optionValue)) {
      // 제거
      onChange(values.filter(v => v !== optionValue));
    } else {
      // 추가
      onChange([...values, optionValue]);
    }
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    onChange(values.filter(v => v !== optionValue));
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Multi Select Box */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`flex min-h-[38px] w-full cursor-text flex-wrap items-center gap-1 rounded-lg border bg-white px-2 py-1 text-sm transition-colors ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'
        }`}
      >
        {/* 선택된 태그들 */}
        {selectedOptions.map((option) => (
          <span
            key={option.value}
            className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
          >
            {option.label}
            <button
              type="button"
              onClick={(e) => handleRemove(option.value, e)}
              className="rounded hover:bg-blue-200"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}

        {/* 검색 Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={values.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] border-0 bg-transparent px-1 text-sm outline-none placeholder:text-gray-400"
        />

        {/* Dropdown Arrow */}
        <div className="flex items-center text-gray-400">
          <svg
            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggle(option.value)}
                className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 검색 결과 없음 */}
      {isOpen && searchTerm && filteredOptions.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-lg">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
}
