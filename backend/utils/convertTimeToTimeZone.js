const convertTimeToTimeZone = (isoDate, targetTimeZone) => {
    // Create a new Date object from the ISO date
    const date = new Date(isoDate);

    // Options for formatting the date in the target time zone
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: targetTimeZone,
        timeZoneName: 'short'
    };

    // Convert the date to the target time zone
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    return formattedDate;
}   

module.exports = convertTimeToTimeZone;