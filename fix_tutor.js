import fs from 'fs';

let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

content = content.replace(
  '<div className="whitespace-pre-wrap">{msg.text}</div>                      {msg.attachments',
  '<>\n<div className="whitespace-pre-wrap">{msg.text}</div>\n                      {msg.attachments'
);

content = content.replace(
  '</a>\n                            </div>\n                          ))}\n                        </div>\n                      )}\n                    ) : (',
  '</a>\n                            </div>\n                          ))}\n                        </div>\n                      )}\n                      </>\n                    ) : ('
);

fs.writeFileSync('src/components/Tutor.tsx', content);

