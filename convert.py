import csv


def getVcardString(name: str, role: str, phone: str) -> str:
    return '''BEGIN:VCARD
VERSION:3.0
PRODID:-//Apple Inc.//macOS 11.3.1//EN
N:{};;;;
FN:{}
ORG:{};
TEL;type=CELL;type=VOICE;type=pref:{}
END:VCARD'''.format(name, name, role, phone)


with open('contacts.csv', 'r') as contact_file:
    reader = csv.DictReader(contact_file, quotechar='"',
                            delimiter=',', quoting=csv.QUOTE_ALL)
    with open('output.vcf', 'w',  encoding="UTF-8") as file:
        for row in reader:
            name = row['성명']
            role = row['직책']
            phone = row['휴대폰']
            file.writelines("{}\n".format(getVcardString(name, role, phone)))
