const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

const lastLines = `        </div>
      )}
    </div>
      </div>
  );
}`;

const newLastLines = `        </div>
      )}
    </div>
        </div>
      </div>
    </div>
  );
}`;

if (code.includes(lastLines)) {
  code = code.replace(lastLines, newLastLines);
  fs.writeFileSync('src/components/Tutor.tsx', code);
  console.log("Patched end!");
} else {
  console.log("Not found.");
}
