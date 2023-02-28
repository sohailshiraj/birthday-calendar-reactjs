import dayjs, { Dayjs } from 'dayjs';

export interface Birthday {
  text: string;
  year: number;
  fav?: boolean;
}

/**
 * save favorites in storage
 * @param value
 * @returns
 */
export function saveFavorites(value: Map<string, any>) {
  return localStorage.setItem(
    'favorites',
    JSON.stringify(Array.from(value.entries()))
  );
}

/**
 * get gavorties from storage
 * @returns Map<string, any>
 */
export function getFavorites(): Map<string, any> | null {
  return localStorage.getItem('favorites')
    ? new Map(JSON.parse(localStorage.getItem('favorites') || '{}'))
    : null;
}

/**
 * Format date to MMM D
 * @param date
 * @returns string
 */
export const getFormattedDate = (date: Dayjs | null | undefined) => {
  return date != null ? dayjs(date).format('MMM D') : '';
};

/**
 * handler for calling rest api for getting birthdays from API
 * @param url
 * @param date
 * @returns formatted array of objects.
 */
export const getBirthdaysFromApi = (url: string, date: Dayjs) => {
  let fav = getFavorites();
  return fetch(url)
    .then((res) => res.json())
    .then((res) => res.births)
    .then((res) => {
      return res.map((item: any) => {
        delete item.pages;
        return item;
      });
    })
    .then((res) => {
      let formattedDate = getFormattedDate(date);
      return res.map((item: any) => {
        if (markedAsFav(fav, formattedDate, item)) item.fav = true;
        return item;
      });
    });
};

/**
 * handler for checking if the row is marked as fav
 * @param favMap
 * @param date
 * @param event
 * @returns boolean
 */
const markedAsFav = (
  favMap: Map<string, any> | null,
  date: string,
  event: any
) => {
  if (favMap != null) {
    if (favMap.has(date)) {
      let arr = favMap.get(date);
      let index = arr.findIndex(
        (item: any) => item.text == event.text && item.year == event.year
      );
      return index == -1 ? false : true;
    } else {
      return false;
    }
  }
  return false;
};
