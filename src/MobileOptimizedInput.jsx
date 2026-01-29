import React from 'react';

const MobileOptimizedInput = ({ type = "text", ...props }) => {
  // استخدام input mode مناسب لنوع البيانات
  const getInputMode = () => {
    switch (type) {
      case 'number': return 'numeric';
      case 'tel': return 'tel';
      case 'email': return 'email';
      default: return 'text';
    }
  };

  return (
    <input
      type={type}
      inputMode={getInputMode()}
      className="w-full px-3 py-3 border-2 rounded-lg text-base bg-white"
      style={{ fontSize: '16px' }} // منع التكبير في iOS
      {...props}
    />
  );
};

export default MobileOptimizedInput;

