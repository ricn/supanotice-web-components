# Release Process

This repository uses GitHub Actions to automatically build and release the Supanotice Web Components library.

## Automatic Releases

### When releases happen
- **Automatic**: Every push to the `main` branch triggers a new release
- **Manual**: You can also create releases manually through GitHub's interface

### What gets released
Each release includes:
- `supanotice-components.es.js` - The main ES module bundle
- `supanotice-components.es.js.map` - Source map for debugging
- `supanotice-components-vX.X.X.zip` - Complete package with all files

### Version numbering
Versions are automatically generated using the format: `1.0.YYYYMMDDHHMMSS-{commit-hash}`

Example: `1.0.20240730231829-a1b2c3d`

## Using releases

### CDN Usage
```html
<!-- Replace {version} with the actual version number -->
<script type="module" src="https://github.com/your-username/supanotice-web-components/releases/download/v{version}/supanotice-components.es.js"></script>

<!-- Use the components -->
<supanotice-widget widget-id="your-widget-id"></supanotice-widget>
<supanotice-preview></supanotice-preview>
```

### Download and host yourself
1. Go to the [Releases page](https://github.com/your-username/supanotice-web-components/releases)
2. Download the latest `supanotice-components-vX.X.X.zip` file
3. Extract and host the files on your server
4. Include the script in your HTML

## NPM Publishing (Optional)

If you want to publish to NPM registry:

### Setup
1. Create an NPM account at [npmjs.com](https://www.npmjs.com)
2. Generate an NPM access token in your NPM account settings
3. Add the token as a GitHub secret named `NPM_TOKEN`:
   - Go to your repository settings
   - Navigate to Secrets and variables > Actions
   - Add a new repository secret: `NPM_TOKEN`

### Publishing
- **Automatic**: The npm-publish workflow runs automatically when you create a GitHub release
- **Manual**: Use the "Publish to NPM" workflow dispatch in the Actions tab

### After NPM publishing
Users can install via npm:
```bash
npm install supanotice-web-components
```

```javascript
import 'supanotice-web-components';
// Components are now available globally
```

## Development Workflow

1. Make your changes and commit them
2. Push to `main` branch
3. GitHub Actions automatically:
   - Builds the library
   - Runs tests (if any)
   - Creates a new release
   - Uploads build artifacts

## Troubleshooting

### Build failures
- Check the Actions tab for detailed error logs
- Ensure all dependencies are properly listed in `package.json`
- Verify that the build command `npm run build:lib` works locally

### Release not created
- Ensure you're pushing to the `main` branch
- Check that the workflow has proper permissions (should be automatic)
- Verify the `GITHUB_TOKEN` has the necessary permissions

### NPM publishing issues
- Verify the `NPM_TOKEN` secret is correctly set
- Ensure the package name is available on NPM
- Check that you have publishing rights to the package name
