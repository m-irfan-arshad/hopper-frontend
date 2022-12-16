import { faker } from '@faker-js/faker'
import moment from "moment";

interface PatientCaseInterface {

    birthDay: string;
    firstName: string;
    lastName: string;
    procedureDate: string;
}

export function createPatientCase(): PatientCaseInterface {

    const birthDate = faker.date.birthdate()
    const birthDateFormatted = moment.utc(birthDate).format("MM/DD/YYYY");
    var someDate = new Date();
    var numberOfDaysToAdd = 6;
    var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    const procedureDateFormatted = moment.utc(result).format("MM/DD/YYYY");

    return {
        birthDay: birthDateFormatted,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        procedureDate: procedureDateFormatted
    };

};




