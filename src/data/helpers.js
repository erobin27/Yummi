import axios from "axios";
import { deleteFile, findFileByFilename, findUser } from "../data/database";

export function inDateRange(day, start, end) {
  if (datesAreOnSameDay(day, start) || datesAreOnSameDay(day, end)) return true;
  if (day > start && day < end) return true;
  else return false;
}

export const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export function menuFunction(choice, entry, email) {
  if (typeof (choice) === 'string')
    choice = choice.toUpperCase();
  switch (choice) {
    case "COPY":
      navigator.clipboard.writeText(entry);
      break;
    
    
    
    case "LOG DATA":
      axios(findUser(email)).then((res) => {
        console.log(res.data[0].files[findFileByFilename(res.data[0], entry)].parsedData)
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
      break;
    
    
    
    case "DELETE":
      axios(deleteFile(email, entry))
        .then((res) => {
          console.log(res);
          window.location.reload(true)
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
      break;
    
    
    
    default:
      console.log('default switch statement')
  }
}