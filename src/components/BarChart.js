import * as React from "react";
import { Card, CardContent, TextField, Typography } from "@material-ui/core/";
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
  Legend
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker } from "@devexpress/dx-react-chart";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { drawerSelection } from "../data/Redux/Actions/index";
import {
  inDateRange,
  getDates,
  datesAreOnSameDay,
  getDateString,
  getSelectedData,
  dayOfWeek
} from "../data/helpers";

const useStyles = makeStyles((theme) => {
  return {
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    title: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center"
    },
    card: {
      backgroundColor: "transparent",
    },
    chart: {
      color: theme.palette.text.primary,
    },
    tooltip: {
      color: theme.palette.primary.main,
    },
  };
});

export default function BarChart(props) {
  let chartData = [];
  let chart = <></>;
  const activeData = props.activeData;
  const classes = useStyles();
  const drawerSelection = useSelector((state) => state.drawer);
  const dateSelection = props.dates;
  const dateFormat = props.dateFormat;

  let titleText = "Select an Item";
  if (props.titleText) titleText = props.titleText;
  let missingData = false;
  if (
    dateSelection &&
    drawerSelection &&
    activeData &&
    props.requireDrawerSelection
  ) {
    titleText =
      (parseInt(dateSelection.start.getMonth()) + 1) +
      "/" +
      dateSelection.start.getDate() +
      " through " +
      (parseInt(dateSelection.end.getMonth()) + 1) +
      "/" +
      dateSelection.end.getDate();
  }

  //SETUP DATA TO BE PASSED TO THE CHART IF ALL VARIABLES HAVE BEEN SET
  if (dateSelection && activeData.dates != undefined) {
    //if none of the data is empty
    if (props.requireDrawerSelection && !drawerSelection) {
      //console.log("no drawer selection");
    } else {
      console.log(activeData);
      chartData = []; //clear data
      const dates = getDates(dateSelection.start, dateSelection.end);
      for (let i = 0; i < dates.length; i++) {
        const dateString = getDateString(dates[i]);
        if (dateString in activeData.dates) {
          //if the date is in the data
          chartData.push({
            //push object onto chart data
            date: dateString,
            data: getSelectedData(
              props.dataChoice,
              activeData,
              dateString,
              drawerSelection
            ), //activeData[drawerSelection][str].Count,
          });
        } else {
          chartData.push({
            date: dateString,
            data: 0,
          });
          missingData = true;
        }
      }

      if (missingData) {
        titleText = titleText + "\t (missing data)";
      }
    }
  }

  const Label = (props) => {
    const classes = useStyles();
    if (dateFormat == "Date") {
      return <ArgumentAxis.Label {...props} text={`${props.text}`} />;
    } else {
      return (
        <ArgumentAxis.Label {...props} text={`${dayOfWeek(props.text)}`} />
      );
    }
  };

  return (
    <div className={ classes.container }>
      <div className={ classes.title }>
        <Typography variant="h4" color='textSecondary'>{drawerSelection}</Typography>
        <Typography variant="h3">
          {props.dataChoice} per day
        </Typography>
      </div>
      <Chart
        data={ chartData }
        className={ classes.chart }
        height={ window.innerHeight * 0.8 }
        rotated={ props.rotated }
      >
        <Title text={titleText} />
        <ArgumentAxis showGrid={false} showTicks={false} labelComponent={Label}/>
        <ValueAxis showGrid={false} />

        <BarSeries valueField="data" argumentField="date" />
        <Animation />
      </Chart>
    </div>
  );
}
