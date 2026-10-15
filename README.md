# MLT Revision Hub

A static, searchable revision portal for Machine Learning Techniques. The hierarchy is **Week → Topic/Chapter section → individual questions**. Each question is stored as its own HTML file and classified as AQ, PA, GA, or PYQ.

## Features

- Weeks 1–12 follow the starter syllabus map; each topic is nested inside its week.
- Search questions, weeks, topics, summaries, and tags.
- Filter by week, topic, category (AQ / PA / GA / PYQ), and revision status.
- Quick recall quiz and interactive pixel-memory calculator.
- MathJax equation rendering and reusable HTML question template.
- Progress saved in local browser storage.

## Course week map

1. PCA — Principal Component Analysis
2. Kernel PCA
3. K-Means and Kernel K-Means
4. MLE, Bayesian Methods, GMM and EM
5. Least Squares and Regression
6. Regularization — Ridge and LASSO
7. KNN and Decision Trees
8. Naive Bayes
9. Perceptron and Logistic Regression
10. Support Vector Machines
11. Ensemble Learning — Bagging and AdaBoost
12. Neural Networks and Multiclass Classification

The week/topic map is a starter based on the list shared for this project. Edit data/weeks.json if your official week-by-week mapping differs. The pixel-memory question belongs in Foundations & Unassigned (week 0), not PCA.

## Question categories

- **AQ** — Activity Question
- **PA** — Practice Assignment
- **GA** — Graded Assignment
- **PYQ** — Previous Year Question

## Add a question

1. Copy questions/_template.html into a uniquely named file, e.g. questions/pca-eigenvectors.html.
2. Replace the title, question, hint, solution, exam traps, and variation.
3. In the progress script, replace replace-with-question-id with the unique ID used below.
4. Add a record to data/questions.json, following this example:

~~~json
{
  "id": "pca-eigenvectors",
  "title": "Finding principal directions",
  "week": 1,
  "weekTitle": "PCA — Principal Component Analysis",
  "topic": "Eigenvalues and eigenvectors",
  "category": "PYQ",
  "difficulty": "Intermediate",
  "summary": "Find eigenvectors of a covariance matrix and interpret their directions.",
  "tags": ["PCA", "eigenvectors", "covariance", "derivation"],
  "url": "questions/pca-eigenvectors.html"
}
~~~

Use a unique id; ensure week matches data/weeks.json; topic should match one of that week's topic labels; and url must point to the actual file. Use week 0 for Foundations & Unassigned.

## Preview locally

Run these commands from the project folder:

~~~bash
python -m http.server 8000
~~~

Open http://localhost:8000. Do not open index.html as a file URL because the browser blocks the JSON fetch.

## Publish with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Select **Deploy from a branch**.
3. Select branch main and folder /(root), then save.
4. GitHub shows the published site URL when deployment is ready.

Repository: https://github.com/amanmauryas/mlt_revision_hub

## Important limitations

This is a static site. It has no sign-in, database, or built-in editor that commits a question back to GitHub. New questions are added by creating an HTML file and updating data/questions.json, then committing the files. Revision progress is stored in this browser and does not sync across devices. MathJax is loaded from a CDN, so equation rendering requires internet access. Do not place secrets in a public repository.
