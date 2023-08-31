
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useTranslation} from "react-i18next";

//chuyển đối tượng date về dạng yyyy-mm-dd
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

//chuyển đối tượng date về dạng dd/mm/yyyy
export function changeDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

//chuyển sang định dạng thứ, ngày , tháng, năm:
export const convertDate = (dateStr) => {
  let dateObject = new Date(dateStr);
  // let daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayOfWeek = daysOfWeek[dateObject.getDay()];
  let day = dateObject.getDate();
  // let month = dateObject.getMonth() + 1;
  let month = dateObject.toLocaleString('default', { month: 'long' });
  let year = dateObject.getFullYear();
  let newFormat = {dayOfWeek: `${dayOfWeek}`, day:`${day}`, month: `${month}`, year: `${year}`}

  return newFormat;
}

// chuyển định dạng yyyy-mm-dd sang date object:
export function parseDate(input) {
  var parts = input.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]); 
}

export default function DatePickerComponent({ getDate, dateBefore }) {
  const {t}=useTranslation()
  const [selectedDate, setSelectedDate] = useState(dateBefore ? parseDate(dateBefore) : new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
    let dateString = formatDate(date);
    getDate(dateString);
  };

  const CustomDatePickerInput = ({ value, onClick }) => (
    <button className='relative' onClick={onClick}>
      <p className='text-[12px] pb-[3px] text-slate-400 text-start'>{t("Date")}</p>
      <div className='wrap-text-icon mb-1'>
        <div className='p-1 custom-date-picker'>{value}</div>
        <div className='ml-[120px] mt-2'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </button>);

  return (
    <DatePicker
      className="p-1 custom-date-picker text-semibold"
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy"
      customInput={
        <CustomDatePickerInput />
      }
    />
  );
}