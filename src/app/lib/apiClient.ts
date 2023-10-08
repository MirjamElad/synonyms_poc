//TODO: How about a config file/component!?
const _TIMEOUT_ = 4000;

//https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
function withTimeout(ms: number, promise: Promise<any>) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('OPERATION TIMED OUT'));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
  });
}


export const GET = async (
    input: Record<string, string | number | boolean | Date> | string,
    onSuccess: (data: any) => void,
    onFailure: (error: any) => void
) => {
    let fetchUrl = '/api/synonyms/';
    if (typeof input !== 'string') {
        fetchUrl += '?';
        for (const key in input) {
            const value =
            input[
                key as keyof Record<string, string | number | boolean | Date>
            ];
            fetchUrl += `${key}=${value}&`;
        }
    } else {
        fetchUrl += input;
    }
  
    return await withTimeout(
        _TIMEOUT_,
        window
        .fetch(fetchUrl, {
            method: 'GET',
            //TODO: no-cache!!
            headers: { 'Content-Type': 'application/json', 'pragma': 'no-cache', 'cache-control': 'no-cache' },
        })
        .then((r) => {
            if (r.ok) {
                return r.json();
            } else {
                throw new Error(r.statusText || 'Something went wrong!');
            }
        })
        .then(onSuccess)
        .catch(onFailure)
    );
};

export const POST = (
        input: Object,
        onSuccess: (data: any) => void,
        onFailure: (error: any) => void
    ) =>
    withTimeout(
        _TIMEOUT_,
        window
        .fetch('/api/synonyms/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        })
        .then((r) => {
            if (r.ok) {
                return r.json();
            } else {
                throw new Error(r.statusText || 'Something went wrong!');
            }
        })
        .then(onSuccess)
        .catch(onFailure)
    );
