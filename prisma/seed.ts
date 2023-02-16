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
        await prisma.locations.create({   //create locations
            data: {
                locationName: chance.city(),
                fhirResourceId: chance.string({ length: 10 }),
                procedureUnits: {    // create PUs under each location
                    create: [...Array(2)].map(()=>({ 
                        fhirResourceId: chance.string({ length: 10 }),
                        procedureUnitName: 'pu' + chance.word({ syllables: 2 }),
                        serviceLines: {    // create SLs under each PU
                            create: [...Array(2)].map(()=>({
                                fhirResourceId: chance.string({ length: 10 }),
                                serviceLineName: 'sl' + chance.word({ syllables: 2 }),
                                providers: {    // create provider relationship for each SL
                                    create: [...Array(3)].map(()=>({
                                        provider: {    // create providers for each provider relationship
                                            create: {
                                                fhirResourceId: chance.string({ length: 10 }),
                                                firstName: chance.first({ nationality: 'en' }),
                                                lastName: chance.last({ nationality: 'en' }),
                                                address: chance.address()
                                            }
                                        }
                                    }))
                                }
                            }))
                        }
                    }))
                }
            }
        })
    }

    await prisma.locations.create({   //create static location for integration test
        data: {
            locationName: 'Feeleove',
            fhirResourceId: chance.string({ length: 10 }),
            procedureUnits: { 
                create: [{ 
                    fhirResourceId: chance.string({ length: 10 }),
                    procedureUnitName: 'pugigu',
                    serviceLines: {
                        create: [{
                            fhirResourceId: chance.string({ length: 10 }),
                            serviceLineName: 'slfuhge',
                            providers: {
                                create: [{
                                    provider: {
                                        create: {
                                            fhirResourceId: chance.string({ length: 10 }),
                                            firstName: 'Edgar',
                                            lastName: 'McGee',
                                            address: chance.address()
                                        }
                                    }
                                }]
                            }
                        }]
                    }
                }]
            }
        }
    })
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