* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: Arial, Helvetica, sans-serif;
    background: #f3f4f6;
      color: #111827;
        min-height: 100vh;
          display: flex;
            align-items: center;
              justify-content: center;
              }

              .container {
                width: 100%;
                  max-width: 600px;
                    padding: 24px;
                      text-align: center;
                      }

                      h1 { font-size: 2rem; margin-bottom: 8px; }

                      .sub { color: #6b7280; margin-bottom: 28px; }

                      .options {
                        display: flex;
                          gap: 16px;
                            flex-wrap: wrap;
                              justify-content: center;
                              }

                              .card {
                                flex: 1 1 220px;
                                  background: #fff;
                                    border: 2px solid #e5e7eb;
                                      border-radius: 14px;
                                        padding: 28px 16px;
                                          text-decoration: none;
                                            color: inherit;
                                              display: flex;
                                                flex-direction: column;
                                                  align-items: center;
                                                    gap: 10px;
                                                      transition: transform .15s, border-color .15s;
                                                      }

                                                      .card:hover { transform: translateY(-3px); border-color: #2563eb; }

                                                      .icon { font-size: 2.2rem; }
                                                      .title { font-weight: bold; font-size: 1.1rem; }