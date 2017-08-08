import superagent from 'superagent';

export default function () {
  return new Promise((resolve, reject) => {
    superagent.get('http://localhost:8081/images')
      .then(response => {
        resolve(response.body.files);
      })
      .catch(e => reject('error'));
  });
}
