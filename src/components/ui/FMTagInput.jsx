import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

export function FMTagInput({
  value = [],
  onChange,
  placeholder = "문자열 입력 후 엔터키 입력",
  disabled = false,
  className = "",
}) {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyDown = (e) => {
    // 한글 조합 중일 때는 처리하지 않음
    if (isComposing || e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // 입력값이 없을 때 백스페이스로 마지막 태그 삭제
      onChange(value.slice(0, -1));
    }
  };

  const handleRemove = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={className}>
      <div
        className={`flex w-full flex-wrap items-center gap-2 rounded-lg border border-gray-300 px-2 py-1.5 transition-colors ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white focus-within:border-blue-500'
        }`}
        onClick={handleContainerClick}
      >
        {value.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-sm text-blue-700"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                aria-label={`${tag} 삭제`}
                className="rounded-full p-0.5 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          spellCheck="false"
          className="min-w-[100px] flex-grow bg-transparent px-1 py-0.5 text-sm outline-none disabled:cursor-not-allowed disabled:text-gray-400"
        />
      </div>
    </div>
  );
}
