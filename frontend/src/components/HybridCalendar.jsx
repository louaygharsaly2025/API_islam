// src/components/HybridCalendar.jsx
import React, { useState, useEffect } from 'react';

export default function HybridCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hijriData, setHijriData] = useState({});
  const [loading, setLoading] = useState(false);
  const [specialDates, setSpecialDates] = useState({});
  const [monthEvents, setMonthEvents] = useState([]);
  const [hijriMonthRange, setHijriMonthRange] = useState('');
  const [calendarDays, setCalendarDays] = useState([]);
  const [autoShowDate, setAutoShowDate] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(false);

  /* ------------------ Helper Functions ------------------ */
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setAutoShowDate(null);
    setEventsLoading(true);
  };

  const getIndonesianMonthName = (m) =>
    ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][m];
  const getIndonesianMonthShortName = (m) =>
    ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][m];
  const getIndonesianDayName = (d) =>
    ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][d];

  const getHijriMonthName = (num) => ({
    1: 'Muharram', 2: 'Safar', 3: 'Rabiul Awal', 4: 'Rabiul Akhir',
    5: 'Jumadil Awal', 6: 'Jumadil Akhir', 7: 'Rajab', 8: 'Sya’ban',
    9: 'Ramadhan', 10: 'Syawal', 11: 'Dzulqa’dah', 12: 'Dzulhijjah'
  }[num] || '');

  const handleDateClick = (d) => { setSelectedDate(d); setAutoShowDate(null); };

  const getEventsForDate = (date, hijriInfo) => {
    const ev = [];
    const day = date.getDay();
    const fDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString().padStart(2, '0')}-${date.getFullYear()}`;

    if (day === 1) ev.push({ title: 'Puasa Senin', category: 'Puasa Sunnah', color: 'blue' });
    if (day === 4) ev.push({ title: 'Puasa Kamis', category: 'Puasa Sunnah', color: 'yellow' });
    if (hijriInfo && [13, 14, 15].includes(parseInt(hijriInfo.day)))
      ev.push({ title: 'Puasa Yaumul Bidh', category: 'Puasa Sunnah', color: 'green' });
    if (specialDates[fDate])
      ev.push({ title: specialDates[fDate], category: 'Hari Besar & Libur Nasional', color: 'red' });

    return ev;
  };

  /* ------------------ Effects ------------------ */
  useEffect(() => {
    setSpecialDates({ '01-01-2025': 'Tahun Baru Masehi' });
  }, []);

  useEffect(() => {
    const fetchHijriMonthData = async (y, m) => {
      try {
        setLoading(true); setEventsLoading(true);
        const dInM = getDaysInMonth(y, m);
        const newHijriData = { ...hijriData };

        for (let d = 1; d <= dInM; d++) {
          const f = `${String(d).padStart(2, '0')}-${String(m + 1).padStart(2, '0')}-${y}`;
          if (newHijriData[f]) continue;
          try {
            const res = await fetch(`https://api.aladhan.com/v1/gToH/${f}?calendarMethod=UAQ`);
            const data = await res.json();
            if (data.code === 200) newHijriData[f] = data.data.hijri;
          } catch (err) { console.error(err); }
          await new Promise(r => setTimeout(r, 30));
        }
        setHijriData(newHijriData);
      } finally { setLoading(false); }
    };
    fetchHijriMonthData(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  useEffect(() => {
    const y = currentDate.getFullYear(), m = currentDate.getMonth();
    const dInM = getDaysInMonth(y, m), fDay = getFirstDayOfMonth(y, m), days = [];
    const prevM = m === 0 ? 11 : m - 1, prevY = m === 0 ? y - 1 : y;
    const dPrev = getDaysInMonth(prevY, prevM);
    for (let i = fDay - 1; i >= 0; i--) days.push({ date: new Date(prevY, prevM, dPrev - i), isCurrentMonth: false });
    for (let i = 1; i <= dInM; i++) days.push({ date: new Date(y, m, i), isCurrentMonth: true });
    const nextM = m === 11 ? 0 : m + 1, nextY = m === 11 ? y + 1 : y;
    const left = 42 - days.length;
    for (let i = 1; i <= left; i++) days.push({ date: new Date(nextY, nextM, i), isCurrentMonth: false });
    setCalendarDays(days);
  }, [currentDate]);

  useEffect(() => {
    if (!Object.keys(hijriData).length) return;
    const y = currentDate.getFullYear(), m = currentDate.getMonth(), dInM = getDaysInMonth(y, m);
    const events = [], hijriMonths = new Set();
    for (let d = 1; d <= dInM; d++) {
      const date = new Date(y, m, d);
      const f = `${String(d).padStart(2, '0')}-${String(m + 1).padStart(2, '0')}-${y}`;
      if (hijriData[f]) hijriMonths.add(getHijriMonthName(hijriData[f].month.number));
      const ev = getEventsForDate(date, hijriData[f]);
      if (ev.length > 0) events.push({ date, formattedDate: f, events: ev, hijriInfo: hijriData[f] });
    }
    setHijriMonthRange([...hijriMonths].join(' - '));
    setMonthEvents(events); setEventsLoading(false);
  }, [currentDate, hijriData]);

  useEffect(() => {
    if (!loading && monthEvents.length > 0 && !selectedDate && !autoShowDate) {
      const today = new Date();
      if (today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()) {
        setAutoShowDate(today);
      }
    }
  }, [loading, monthEvents, selectedDate, autoShowDate, currentDate]);

  /* ------------------ Render ------------------ */
  const displayDate = selectedDate || autoShowDate;
  const year = currentDate.getFullYear(), month = currentDate.getMonth();

  return (
    <div className="max-w-xl mx-auto px-1 pt-3 shadow-sm">
      {/* Header bulan */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 text-[#6d9bbc]">
          <i className="ri-arrow-left-s-line text-xl"></i>
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#355485]">{getIndonesianMonthName(month)} {year}</h2>
          {hijriMonthRange && (
            <p className="text-xs text-[#6d9bbc] mt-0.5">{hijriMonthRange} H</p>
          )}
        </div>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 text-[#6d9bbc]">
          <i className="ri-arrow-right-s-line text-xl"></i>
        </button>
      </div>

      {/* Grid hari */}
      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="text-xs font-medium text-[#355485] py-1">{d}</div>
        ))}
        {calendarDays.map((dayObj, idx) => {
          const d = dayObj.date, f = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
          const hijriInfo = hijriData[f], events = getEventsForDate(d, hijriInfo);
          const isToday = new Date().toDateString() === d.toDateString();
          const isSel = displayDate && displayDate.toDateString() === d.toDateString();
          return (
            <div key={idx} onClick={() => dayObj.isCurrentMonth && handleDateClick(d)}
              className={`h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer relative transition-all
              ${dayObj.isCurrentMonth ? (isSel ? 'bg-[#e9f1f8] text-[#355485] font-bold' :
                  isToday ? 'bg-[#d4e6f6] border border-[#6d9bbc]' : 'hover:bg-gray-100 text-gray-700')
                  : 'text-gray-400'}`}>
              <span className="text-sm">{d.getDate()}</span>
              {events.length > 0 && (
                <div className="absolute bottom-1 flex space-x-0.5">
                  {events.map((e, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full 
                      ${e.color === 'blue' ? 'bg-blue-500' :
                        e.color === 'yellow' ? 'bg-yellow-400' :
                          e.color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail tanggal terpilih */}
      {displayDate && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-[#f0f1f2] shadow-sm">
          <h5 className="text-sm font-semibold text-[#355485]">
            {getIndonesianDayName(displayDate.getDay())}, {displayDate.getDate()} {getIndonesianMonthShortName(displayDate.getMonth())} {displayDate.getFullYear()}
          </h5>
          {hijriData[`${String(displayDate.getDate()).padStart(2, '0')}-${String(displayDate.getMonth() + 1).padStart(2, '0')}-${displayDate.getFullYear()}`] && (
            <p className="text-xs text-[#6d9bbc]">
              {hijriData[`${String(displayDate.getDate()).padStart(2, '0')}-${String(displayDate.getMonth() + 1).padStart(2, '0')}-${displayDate.getFullYear()}`].day}
              {' '}{getHijriMonthName(hijriData[`${String(displayDate.getDate()).padStart(2, '0')}-${String(displayDate.getMonth() + 1).padStart(2, '0')}-${displayDate.getFullYear()}`].month.number)}
              {' '}{hijriData[`${String(displayDate.getDate()).padStart(2, '0')}-${String(displayDate.getMonth() + 1).padStart(2, '0')}-${displayDate.getFullYear()}`].year} H
            </p>
          )}
        </div>
      )}

      {/* Daftar Event Bulanan */}
      <div className="mt-2 space-y-4">
        {monthEvents.map((ev, i) => (
          <div key={i} className="flex items-start bg-white p-3 border rounded-md border-[#f0f1f2] shadow-sm">
            <div className={`w-12 h-12 flex flex-col items-center justify-center rounded-md mr-3 
              ${ev.events[0].color === 'blue' ? 'bg-blue-100 text-blue-700' :
                ev.events[0].color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  ev.events[0].color === 'green' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <span className="text-xs -mb-1">{getIndonesianMonthShortName(ev.date.getMonth())}</span>
              <span className="text-lg font-bold">{ev.date.getDate()}</span>
            </div>
            <div className='pt-1'>
              {ev.events.map((e, j) => (
                <p key={j} className="text-sm font-medium text-[#355485]">{e.title}</p>
              ))}
              {ev.hijriInfo && (
                <p className="text-xs text-[#6d9bbc]">
                  {ev.hijriInfo.day} {getHijriMonthName(ev.hijriInfo.month.number)} {ev.hijriInfo.year} H
                  
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
