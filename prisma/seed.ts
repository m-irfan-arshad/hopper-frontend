import { prisma } from './clientInstantiation';
import Chance from 'chance';

const chance = new Chance();

const locationOptions = ['Healthy Heart Hospital', 'Senior Day Care', 'Burger King', 'Medtel Hospital']
const procedureUnitOptions = ['OR', 'CATH LAB', 'PU1', 'PU2']
const serviceLineOptions = ['Orthopedics', 'Cardiology', 'Oncology']
const providerOptions = [{firstName: 'Sauce', lastName: 'Gardner'}, {firstName: 'Mike', lastName: 'White'}, {firstName: 'Garrett', lastName: 'Wilson'}, {firstName: 'Quincy', lastName: 'Williams'}]

async function createCases() {
    for (let i = 0; i < 50; i++) {
        await prisma.cases.create({
            data: {
                patient: {
                    create: {
                        firstName: chance.first({ nationality: 'en' }),
                        lastName: chance.last({ nationality: 'en' }),
                        mrn: chance.string({ length: 10, numeric: true }),
                        address: chance.address(),
                        mobilePhone: chance.phone({ country: 'us', formatted: true }),
                        dateOfBirth: chance.date({ year: 1970 }),
                    }
                },
                scheduling: {
                    create: {
                        procedureDate: chance.date({ year: new Date().getFullYear(), month: new Date().getMonth() })
                    }
                },
                procedureTab: {create: {}}
            }
        })
    }
}

async function createStateOptions() {
    for (let i = 0; i < 10; i++) {
        await prisma.state.create({ 
            data: {
                stateName: chance.state()
            }
        })
    }
}

async function createInsuranceOptions() {
    await prisma.insurance.createMany({ 
        data: [{insuranceName: "Aetna"}, {insuranceName: "United Health"}]
    })
}

async function createSexOptions() {
    await prisma.sex.createMany({ 
        data: [{sexName: "M"}, {sexName: "F"}, {sexName: "O"}]
    })
}

async function createAdmissionTypeOptions() {
    await prisma.admissionType.createMany({ 
        data: [{admissionTypeName: "admissionType1"}, {admissionTypeName: "admissionType2"}, {admissionTypeName: "admissionType3"}]
    })
}

async function createProcedureOptions() {
    await prisma.procedure.createMany({ 
        data: [{procedureName: "Spine Removal"}, {procedureName: "Brain Swap"}, {procedureName: "Back Massage"}]
    })
}

async function createApproachOptions() {
    await prisma.approach.createMany({ 
        data: [{approachName: "Approach 1"}, {approachName: "Approach 2"}, {approachName: "Approach 3"}]
    })
}

async function createLateralityOptions() {
    await prisma.laterality.createMany({ 
        data: [{lateralityName: "Laterality 1"}, {lateralityName: "Laterality 2"}, {lateralityName: "Laterality 3"}]
    })
}

async function createAnesthesiaOptions() {
    await prisma.anesthesia.createMany({ 
        data: [{anesthesiaName: "General"}, {anesthesiaName: "General and Regional"}, {anesthesiaName: "Local / Minimal Anesthesia"}, {anesthesiaName: "Regional Block"}, {anesthesiaName: "Spinal"}]
    })
}

async function createIcdCodeOptions() {
    await prisma.icdCode.createMany({ 
        data: [{icdCodeName: "1111ICD"}, {icdCodeName: "2222ICD"}, {icdCodeName: "3333ICD"}]
    })
}

async function createCptCodeOptions() {
    await prisma.cptCode.createMany({ 
        data: [{cptCodeName: "1111CPT"}, {cptCodeName: "2222CPT"}, {cptCodeName: "3333CPT"}]
    })
}

async function createLocations() {
    for (let i = 0; i < 4; i++) {
        await prisma.location.create({   //create location
            data: {
                locationName: locationOptions[i],
                fhirResourceId: chance.string({ length: 10 }),
                procedureUnit: {    // create PUs under each location
                    create: [...Array(4)].map((_, j)=>({ 
                        fhirResourceId: chance.string({ length: 10 }),
                        procedureUnitName: procedureUnitOptions[j],
                        serviceLine: {    // create SLs under each PU
                            create: [...Array(3)].map((_, k)=>({
                                fhirResourceId: chance.string({ length: 10 }),
                                serviceLineName: serviceLineOptions[k],
                                provider: {    // create provider relationship for each SL
                                    create: [...Array(4)].map((_, l)=>({
                                        provider: {    // create provider for each provider relationship
                                            create: {
                                                fhirResourceId: chance.string({ length: 10 }),
                                                firstName: providerOptions[l].firstName,
                                                lastName: providerOptions[l].lastName,
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
}

async function main() {
    await Promise.all([
        createCases(),
        createLocations(),
        createStateOptions(),
        createInsuranceOptions(),
        createAdmissionTypeOptions(),
        createSexOptions(),
        createProcedureOptions(),
        createApproachOptions(),
        createLateralityOptions(),
        createAnesthesiaOptions(),
        createCptCodeOptions(),
        createIcdCodeOptions()
    ])
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