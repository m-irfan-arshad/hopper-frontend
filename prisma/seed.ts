import { prisma } from './clientInstantiation';
import Chance from 'chance';

const chance = new Chance();

async function createCases() {
    for (let i = 0; i < 50; i++) {
        await prisma.patients.create({
            data: {
                firstName: chance.first({ nationality: 'en' }),
                lastName: chance.last({ nationality: 'en' }),
                mrn: chance.string({ length: 10, numeric: true }),
                address: chance.address(),
                mobilePhone: chance.phone({ country: 'us', formatted: true }),
                dateOfBirth: chance.date({ year: 1970 }),
                cases: {
                    create: {
                        procedureDate: chance.date({ year: new Date().getFullYear(), month: new Date().getMonth() })
                    } 
                }
            }
        })
    }
}

async function createLocations() {
    for (let i = 0; i < 2; i++) {
        await prisma.locations.create({
            data: {
                locationId: i,
                locationName: chance.city(),
                procedureUnits: {
                    create: [1,2].map(function(){
                        return { 
                            fhirResourceId: chance.string({ length: 10 }),
                            procedureUnitName: 'pu' + chance.word({ syllables: 2 }),
                            serviceLines: {
                                create: [1,2].map(function(){
                                    return {
                                        fhirResourceId: chance.string({ length: 10 }),
                                        serviceLineName: 'sl' + chance.word({ syllables: 2 }),
                                    }
                                })
                            }
                        }
                    }),
                  },
            }
        })
    }
}

async function main() {
    await createCases();
    await createLocations();
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })