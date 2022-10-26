import { prisma } from './clientInstantiation';
import Chance from 'chance';

const chance = new Chance();

async function main() {
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

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })