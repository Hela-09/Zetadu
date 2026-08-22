const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

const endChunk = `            </div>
          </div>
        </div>
      )}
    </div>
        </div>
      </div>
    </div>
  );
}`;

const correctEndChunk = `            </div>
          </div>
        </div>
      )}
    </div>
      </div>
    </div>
  );
}`;

if (code.includes(endChunk)) {
  code = code.replace(endChunk, correctEndChunk);
  fs.writeFileSync('src/components/Tutor.tsx', code);
  console.log("Fixed end!");
} else {
  console.log("Not found.");
}
