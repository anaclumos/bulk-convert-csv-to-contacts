const readline = require('readline')
const fs = require('fs')

const fileStream = fs.createReadStream('./contacts.csv')
const lineReader = readline.createInterface({
  input: fileStream,
})

const getVcardString = ({
  name: name,
  org: org,
  phone: phone,
  note: note,
}: {
  name: string
  org: string
  phone: string
  note: string
}) => {
  return `BEGIN:VCARD
VERSION:3.0
PRODID:-//Apple Inc.//iPhone OS 14.4.2//EN
N:;${name};;;
FN:${name}
ORG:${org};
TEL;type=CELL;type=VOICE;type=pref:${phone}
NOTE:${`당원 분류: ` + org}\\n${
    note === '' ? '추천인: 없음' : '추천인: ' + note
  }
END:VCARD`
}

const headersToExtract = {
  name: '성명',
  org: '단체',
  note: '추천인',
  phone: '휴대폰',
}

let headersId = {
  name: '',
  org: '',
  note: '',
  phone: '',
}

let isFirstLine = true

lineReader.on('line', (line) => {
  if (isFirstLine) {
    let rawHeader = line.split(',')
    Object.keys(headersToExtract).forEach((key: string) => {
      headersId[key] = rawHeader.findIndex(
        (element) => element === headersToExtract[key]
      )
    })
    isFirstLine = false
    console.log(headersId)
  } else {
    let lineArray = line.split(',')
    let oneContact = {
      name: '',
      org: '',
      note: '',
      phone: '',
    }
    Object.keys(headersId).forEach((key: string) => {
      oneContact[key] = lineArray[headersId[key]]
    })
    fs.appendFile('./output.vcf', getVcardString(oneContact), (err) => {
      if (err) throw err
      console.log(oneContact)
    })
  }
})
