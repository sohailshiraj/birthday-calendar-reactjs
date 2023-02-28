import { Grid } from "@mui/material";
import React from 'react';
import './App.css';
import BirthdayList from "./components/BirthdayList";
import Calendar from "./components/Calendar";

import dayjs, { Dayjs } from "dayjs";
import FavoriteList from "./components/FavoriteList";
import { Birthday, getBirthdaysFromApi, getFavorites, getFormattedDate, saveFavorites } from "./helper";

function App() {

  const [birthdays, SetBirthdays] = React.useState<Birthday[]>([])
  const [favorites, SetFavorites] = React.useState(new Map<string, []>())
  const [currentDate, SetCurrentDate] = React.useState<Dayjs>(dayjs())

  /**
   * Getting birthday by current date on initial render
   */
  React.useEffect(() => {
    let fav = getFavorites();
    if(fav != null ) SetFavorites(fav)
    if(currentDate != null ) getAllBirthdaysByDate(currentDate)
  }, [])

  /**
   * event handler for calling api for getting birthday based on date
   * @param date dayjs object
   */
  const getAllBirthdaysByDate = async (date: Dayjs) => {
    let fav = getFavorites();
    SetCurrentDate(date)
    let url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${date.month() + 1}/${date.date()}`;
    SetBirthdays([])
    let response = await getBirthdaysFromApi(url, date)
    SetBirthdays(response);
  }

  /**
   * update favorite list based on user selection
   * @param event birthday event row
   * @param remove 
   */
  const updateFavList = (event: any, remove: boolean = false) => {
    let map = new Map();
    let date: string = getFormattedDate(currentDate)

    //Add case
    if(!remove){
      if(favorites.has(date)) {
        let index = favorites.get(date)?.findIndex((fav: any) => fav.text == event.text)
        if(index == -1) map.set(date, [...(favorites.get(date) as []), event])
      }else{
        map.set(date, [event])
      }

      //update 'fav' for the icon on birthday list
      let updatedArr = birthdays.filter((bday) => {
        if(bday.text == event.text) return bday.fav = true
        else return bday;
      });
      SetBirthdays(updatedArr)
    } else {
      //Remove case
      if(favorites.has(date)) {
        let arr = favorites.get(date)?.filter((item: any) => item.text != event.text)
        if(arr?.length && arr.length > 0) {
          map.set(date, arr)
        }else {
          favorites.delete(date)
        }
        
        //update 'fav' for the icon on birthday list
        let updatedArr = birthdays.filter((bday) => {
          if(bday.text == event.text) delete bday.fav
          
          return bday;
        });
        SetBirthdays(updatedArr)
      }
    }
    let newMap = new Map([...favorites, ...map])
    SetFavorites(newMap)
    saveFavorites(newMap)
  }

  return (
    <div className="App">
      <Grid container
        direction="row"
        justifyContent="space-evenly"
        alignItems="flex-start">
        <Grid item xs={12}>
          <h3>Birthdays Calendar</h3>
        </Grid>
        <Grid item xs={12} md={6}>
          <Calendar date={currentDate} onChange={getAllBirthdaysByDate}/>
        </Grid>
        <Grid item xs={12} md={5}>
          <BirthdayList currentDate={currentDate} birthdays={birthdays} addFavorite={updateFavList} 
          removeFavorite={(e: any, idx)=>updateFavList(e, true)}/>
        </Grid>
        <Grid item xs={12} md={5} >
          <FavoriteList favorites={favorites}/>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
