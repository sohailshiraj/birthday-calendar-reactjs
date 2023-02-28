import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Calendar from "./components/Calendar";
import FavoriteList from "./components/FavoriteList";
import BirthdayList from "./components/BirthdayList";
import { getBirthdaysFromApi, getFavorites, getFormattedDate, saveFavorites } from "./helper";
import dayjs from "dayjs";


describe("when initially rendered", () => {
  it("should render birthdays calendar heading", () => {
    render(<App />);
    const heading = screen.getByText(/birthdays calendar/i);
    expect(heading).toBeInTheDocument();
  });
  it("should render select date heading", () => {
    render(<Calendar date={dayjs()} onChange={()=>{}}/>);
    const heading = screen.getByText(/select date/i);
    expect(heading).toBeInTheDocument();
  });
  it("should render select date heading", () => {
    let mockMap = new Map()
    render(<FavoriteList favorites={mockMap}/>);
    const heading = screen.getByText(/Your Favorites/i);
    expect(heading).toBeInTheDocument();
  });
  it("should render birthday with date heading", () => {
    render(<BirthdayList currentDate={dayjs()} birthdays={[]} 
      addFavorite={()=>{}} removeFavorite={()=>{}}/>);
    let txt = `birthdays on ${getFormattedDate(dayjs())}`
    const heading = screen.getByText(new RegExp(txt, "i"));
    expect(heading).toBeInTheDocument();
  });
});

let MockBdays = [
  {
    text: 'Morgan Roy',
    year: 1996
  },
  {
    text: 'Jason Keep',
    year: 1985,
    fav: true
  },
  {
    text: 'Elon Musk',
    year: 2006
  },
  {
    text: 'Tim Jay',
    year: 1990
  },
  {
    text: 'Alex Morgan',
    year: 2003
  },
  {
    text: 'Andrew John',
    year: 2013
  }
]

describe("when renders birthday list", () => {
  
  it("should be a correct list", () => {
    render(<BirthdayList currentDate={dayjs()} birthdays={MockBdays} 
      addFavorite={()=>{}} removeFavorite={()=>{}}/>);

    const BdayRows = screen.getAllByRole('birthdayRow');
    expect(BdayRows[0]).toHaveTextContent("Morgan Roy")
    expect(BdayRows[0]).toHaveTextContent("1996")
    expect(BdayRows.length).toEqual(5)
    expect(screen.getAllByTestId('favorite border')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('favorite')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('favorite').length).toEqual(1)
  })

  it("should call correct function on adding Favorite", () => {
    const onAddFavMock = jest.fn();
    render(<BirthdayList currentDate={dayjs()} birthdays={MockBdays} 
      addFavorite={onAddFavMock} removeFavorite={()=>{}}/>);
  
    fireEvent.click(screen.getAllByTestId('favorite border')[0]);

    expect(onAddFavMock).toHaveBeenCalled();
    expect(onAddFavMock).toHaveBeenCalledWith({
      text: 'Morgan Roy',
      year: 1996
    });
  })

  it("should call correct function on removing Favorite", () => {
    const onRemoveFavMock = jest.fn();
    render(<BirthdayList currentDate={dayjs()} birthdays={MockBdays} 
      addFavorite={()=>{}} removeFavorite={onRemoveFavMock}/>);
    
    fireEvent.click(screen.getAllByTestId('favorite')[0]);

    expect(onRemoveFavMock).toHaveBeenCalled();
    expect(onRemoveFavMock).toHaveBeenCalledWith({
      text: 'Jason Keep',
      year: 1985,
      fav: true
    });
  })

  it("should change original birthday rows upon search", () => {
    render(<BirthdayList currentDate={dayjs()} birthdays={MockBdays} 
      addFavorite={()=>{}} removeFavorite={()=> {}}/>);

    const originalRowsLength = (screen.getAllByRole('birthdayRow')).length;
    const searchField = screen.getByLabelText('Search');
    fireEvent.change(searchField, { target: { value: 'morgan' } })

    const filteredRowsLength = (screen.getAllByRole('birthdayRow')).length;
    expect(filteredRowsLength).toBeLessThan(originalRowsLength)
    expect(filteredRowsLength).toEqual(2)
  })
})

describe("when renders calendar", () => {
  it("should called function upon change", () => {
    const onChangeMock = jest.fn();
    render(<Calendar date={dayjs()} onChange={onChangeMock}/>);

    const calendarDate = screen.getByRole('gridcell', { selected: true })
    fireEvent.click(calendarDate)

    expect(onChangeMock).toBeCalled();
  })
})

describe("when renders favourite list", () => {
  let favListMock = new Map();
  favListMock.set(getFormattedDate(dayjs()), [
    {
      text: 'Jason Keep',
      year: 1985,
      fav: true
    }
  ]) 

  it("should render favorite lists", () => {
    render(<FavoriteList favorites={favListMock}/>);

    const FavouritesList = screen.getAllByRole('date')

    expect(FavouritesList[0]).toHaveTextContent(getFormattedDate(dayjs()));
  })

  it("should save in storage correctly", () => {
    saveFavorites(favListMock);

    let fav = getFavorites()

    expect(fav).toEqual(favListMock)
  })
})