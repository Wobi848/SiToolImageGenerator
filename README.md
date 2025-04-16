# Si-Tool Image Generator

## Description

Si-Tool Image Generator is a simple web application that generates images for Si-Tool (BMR or DDC4000). The application also provides a download section for pre-created editor.xml files for both platforms.

## Getting Started

### Prerequisites

* Node.js (version 14 or higher)
* npm (version 6 or higher)

### Installation

1. Clone the repository: `git clone https://github.com/Wobi848/SiToolImageGenerator.git`
2. Install dependencies: `npm install`
3. Start the application: `npm start`

### Usage

* Website is hosted on `https://kp.rappo.dev` and will use this git.
* Open a web browser and navigate to `https://kp.rappo.dev` to check it out.
* You can also use the `npm run build` command to build the application for personal use.

## Features

* Generates images for Si-Tool (DDC4000 & DDC420/BMR platforms)
* Platform-specific generation options with proper versioning
* Provides a download section for pre-created editor.xml files
* Filter downloads by platform type (DDC4000/DDC420)
* Search functionality for finding specific editor files
* Responsive design for desktop and mobile devices
* Accessibility improvements
* SEO optimized

## To-Do

* Refactor code for better maintainability
* Add rows function for more complex layouts
* ~~Add auto numbering function, a lot of objects just use numbers~~
* ~~Add platform="BMR" version="2.01.1" (S066_cr.editor.xml)~~
* ~~Update/improve download sections, may not work properly~~

## Known Bugs

* If you encounter any issues, please report them in the issues section of this repository.
* ~~Remove Inputs, doesn't count probably~~
* ~~Width changes back to default on generate, add right setting~~ (Fixed in v1.2.3)
* ~~Wrong Platform with PS4000~~ (Fixed in v1.2.1)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

Si-Tool Image Generator is released under the MIT License.

## Authors

* RAT / wobi848

## Version History

* v1.3.1 - April 16, 2025
  * Updated version number
  * Maintenance release

* v1.3.0 - April 16, 2025
  * Added platform filtering in download section
  * Improved responsive design
  * Accessibility and SEO enhancements
  * Fixed layout issues
  
* v1.2.3 - Previous release
  * Fixed width resetting issue
  * Added settings persistence
  
* v1.2.1 - Early release
  * Fixed platform detection for PS4000
  * Bug fixes and performance improvements

## Acknowledgments

* Thanks to font-awesome for making this project possible.
