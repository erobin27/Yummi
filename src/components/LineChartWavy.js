import * as React from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  FormLabel,
  FormControlGroup,
} from "@material-ui/core/";
import {
  Chart,
  BarSeries,
  LineSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { curveCatmullRom, line } from "d3-shape";
import {
  Animation,
  EventTracker,
  HoverState,
} from "@devexpress/dx-react-chart";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { drawerSelection } from "../data/Redux/Actions/index";
import {
  inDateRange,
  getDates,
  datesAreOnSameDay,
  getDateString,
  getSelectedData,
  dayOfWeek,
} from "../data/helpers";

const useStyles = makeStyles((theme) => {
  return {
    container: {
      width: "100%",
      height: '100'
    },
    card: {
      backgroundColor: "transparent",
    },
    chart: {
      color: theme.palette.text.primary,
      cursor: "pointer",
    },
    tooltip: {
      color: theme.palette.primary.main,
    },
    arrow: {
      "&::after": {
        background: theme.palette.secondary.main,
        cursor: "pointer",
      },
    },
    sheet: {
      background: theme.palette.secondary.main,
      cursor: "pointer",
    },
    line: {
      cursor: "pointer",
    },
    switchLabel: {
      color: theme.palette.text.primary,
    },
    formControl: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around'
    }
  };
});

export default function LineChartWavy(props) {
  let chartData = [];
  let chart = <></>;
  const activeData = props.activeData;
  const classes = useStyles();
  const drawerSelection = useSelector((state) => state.drawer);
  const dateSelection = props.dates;
  const [ dateFormat, setDateFormat ] = React.useState("Date");
  const [ rotated, setRotated] = React.useState(props.rotated);

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
      drawerSelection +
      " sold between " +
      (parseInt(dateSelection.start.getMonth()) + 1) +
      "/" +
      dateSelection.start.getDate() +
      " and " +
      (parseInt(dateSelection.end.getMonth()) + 1) +
      "/" +
      dateSelection.end.getDate();
  }

  //SETUP DATA TO BE PASSED TO THE CHART IF ALL VARIABLES HAVE BEEN SET
  if (dateSelection && activeData.dates != undefined) {
    //if none of the data is empty
    if (props.requireDrawerSelection && !drawerSelection) {
      console.log("no drawer selection");
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

  const Arrow = (props) => {
    const classes = useStyles();
    return (
      <Tooltip.Arrow {...props} placement="right" className={classes.arrow} />
    );
  };
  const Sheet = (props) => {
    const classes = useStyles();
    return <Tooltip.Sheet {...props} className={classes.sheet} />;
  };
  const Content = (props) => {
    const classes = useStyles();
    return (
      <Tooltip.Content
        {...props}
        text={`$${props.text} earned on ${
          chartData[props.targetItem.point].date
        }`}
      />
    );
  };
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
    <div className={classes.container}>
      <Chart
        data={chartData}
        className={classes.chart}
        height={window.innerHeight * 0.9}
        rotated={rotated}
      >
        <Title text={titleText} />
        <ArgumentAxis
          showGrid={false}
          showTicks={false}
          labelComponent={Label}
        />
        <ValueAxis showGrid={false} />

        <LineSeries valueField="data" argumentField="date" />
        <Animation />
        <EventTracker />
        <HoverState />
        <Tooltip
          sheetComponent={Sheet}
          arrowComponent={Arrow}
          contentComponent={Content}
        />
      </Chart>
      <FormControl className={classes.formControl}>
        <FormControlLabel
          control={
            <Switch
              color="TextSecondary"
              color="info"
              onChange={(event) => {
                if (event.target.checked) {
                  setDateFormat("Day");
                } else {
                  setDateFormat("Date");
                }
              }}
            />
          }
          label={<Typography variant="h6">{dateFormat}</Typography>}
          className={classes.switchLabel}
        />
        <FormControlLabel
          control={
            <Switch
              color="TextSecondary"
              color="info"
              onChange={(event) => {
                if (event.target.checked) {
                  setRotated(true);
                } else {
                  setRotated(false);
                }
              }}
            />
          }
          label={<Typography variant="h6">Rotate</Typography>}
          className={classes.switchLabel}
        />
      </FormControl>
    </div>
  );
}
