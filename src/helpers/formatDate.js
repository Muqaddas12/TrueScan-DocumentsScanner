const formatDate = (modificationTime) => {
  const timestamp = new Date(modificationTime); // Assuming modificationTime is already in ISO string or timestamp
  const day = timestamp.getDate();
  const month = timestamp.toLocaleString('en-GB', { month: 'short' }); // Short month name (e.g., 'Apr')
  const year = timestamp.getFullYear();
  
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  const hourIn12 = hours % 12 || 12; // If hours is 0 (midnight), use 12 for 12 AM.
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading 0 if minutes are less than 10

  // Return in the desired format
  return `${day} ${month} ${year} ${hourIn12}:${formattedMinutes} ${period}`;
};

export default formatDate;
