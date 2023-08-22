app
 ┣ controllers
 ┃ ┣ assetController.js
 ┃ ┣ userController.js
 ┃ ┣ portfolioController.js
 ┃ ┗ transactionController.js
 ┣ middlewares
 ┃ ┗ authMiddleware.js
 ┣ models
 ┃ ┣ Asset.js
 ┃ ┣ Transaction.js
 ┃ ┣ User.js
 ┃ ┣ Portfolio.js
 ┃ ┣ PortfolioAsset.js
 ┃ ┗ index.js
 ┣ routers
 ┃ ┣ assetRouter.js
 ┃ ┣ userRouter.js
 ┃ ┣ portfolioRouter.js
 ┃ ┗ transactionRouter.js
 ┣ utils
 ┃ ┗ dbUtils.js
 ┗ database.js
migrations
 ┣ deploy
 ┃ ┗ init.sql
 ┣ revert
 ┃ ┗ init.sql
 ┗ verify
     ┗ init.sql
