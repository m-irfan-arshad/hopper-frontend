import { faker } from '@faker-js/faker'
import moment from "moment";



interface PatientCaseInterface{

birthDay: string;
firstName: string;
lastName: string;

}

 export function createPatientCase(): PatientCaseInterface{

    const birthDate = faker.date.birthdate()
    const birthDateFormatted = moment.utc(birthDate).format("MM/DD/YYYY");

    return {
        birthDay: birthDateFormatted,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

};




