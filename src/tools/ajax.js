import { baseURL } from './config';

function request(method, url, data) {
    return fetch(baseURL + url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': localStorage.getItem('token')
        },
        credentials: 'include'
    }).then(res => {
        if (res.status === 200)
            return res.json()
        throw res
    })
}
export default {
    request: request,
    get: url => request('GET', url),
    post: (url, data) => request('POST', url, data)
}
