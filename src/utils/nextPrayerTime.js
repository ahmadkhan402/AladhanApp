export const getNextPrayer = (prayerTimes) => {
    const now = new Date();
    const prayerNames = Object.keys(prayerTimes);
    let nextPrayer = null;
    let minTimeDifference = Infinity;

    prayerNames.forEach((prayer) => {
        const [hours, minutes] = prayerTimes[prayer].split(':').map(Number);
        let prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);
        let timeDifference = prayerTime - now;

        // If timeDifference is negative, set prayer time for the next day
        if (timeDifference < 0) {
            prayerTime.setDate(prayerTime.getDate() + 1);
            timeDifference = prayerTime - now;
        }

        if (timeDifference > 0 && timeDifference < minTimeDifference) {
            minTimeDifference = timeDifference;
            nextPrayer = prayer;
        }

    });


    return nextPrayer;
};
