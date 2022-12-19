import moment from "moment";
import Chance from 'chance';

const chance = new Chance();

interface PatientCaseInterface {
    birthDay: string;
    firstName: string;
    lastName: string;
    procedureDate: string;
}

export function createPatientCase(): PatientCaseInterface {
    const birthDate = moment.utc(chance.birthday()).format("MM/DD/YYYY")
    const someDate = new Date();
    const numberOfDaysToAdd = 6;
    const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    const procedureDateFormatted = moment.utc(result).format("MM/DD/YYYY");

    return {
        birthDay: birthDate,
        firstName: chance.first(),
        lastName: chance.last(),
        procedureDate: procedureDateFormatted
    };
};




