# Using the API etc:

To skip actually generating new image (which consumes credits at the AI-service), you can add the "use-mock" query param like this:
(_May be combined with other query params mentioned in this doc_)
```
http://localhost:3000/api/slack-daily?use-mock
```

To get around the "spam"-blocker (which tries to prevent multiple requests to generate new images on the same date), you can add the "force" query param like this:
(_May be combined with other query params mentioned in this doc_)
```
http://localhost:3000/api/slack-daily?force
```
