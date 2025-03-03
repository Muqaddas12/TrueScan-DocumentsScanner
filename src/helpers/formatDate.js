const formatDate = (modificationTime) => {
    const timestamp = modificationTime * 1000; // Convert seconds to milliseconds
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  export default formatDate