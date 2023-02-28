import React from "react";
import PropTypes from 'prop-types';
import '../App.css';
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";

function FavoriteList({favorites, ...props}: FavoriteListProps) {
    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <h5>Your Favorites</h5>
                <div className="FavList">
                    {
                        [...favorites].map((fav, idx) => {
                            return (
                                <React.Fragment key={idx}>
                                    <Typography role="date" variant={'body1'}>{`${idx + 1}. ${fav[0]}`}</Typography>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        {
                                            fav[1].map((item, i) => {
                                                return (
                                                    <Typography role="text" variant={'caption'} key={idx+i}>{item['text']}</Typography>
                                                );
                                            })
                                        }
                                    </div>
                                </React.Fragment>
                            );
                        })                
                    }
                </div>
            </Grid>
        </Grid>
    );
}

const propTypes = {
    favorites: PropTypes.instanceOf(Map<string, []>).isRequired
}
type FavoriteListProps = PropTypes.InferProps<typeof propTypes>;

export default FavoriteList;