import os
import json
import re
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class CodeGeneratorAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "AI Code Generator"
        logger.info("🔧 CodeGeneratorAgent initialized")
        self.supported_languages = {
            'python': {'ext': '.py', 'test_framework': 'pytest'},
            'javascript': {'ext': '.js', 'test_framework': 'jest'},
            'typescript': {'ext': '.ts', 'test_framework': 'jest'},
            'java': {'ext': '.java', 'test_framework': 'junit'},
            'csharp': {'ext': '.cs', 'test_framework': 'nunit'},
            'go': {'ext': '.go', 'test_framework': 'testing'},
            'rust': {'ext': '.rs', 'test_framework': 'cargo test'},
            'php': {'ext': '.php', 'test_framework': 'phpunit'},
            'ruby': {'ext': '.rb', 'test_framework': 'rspec'},
            'swift': {'ext': '.swift', 'test_framework': 'xctest'}
        }

    def get_input_keys(self) -> list:
        return ["description", "language", "framework", "complexity", "include_tests"]

    def get_output_keys(self) -> list:
        return ["generated_code", "test_files", "documentation", "setup_instructions", "api_docs"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        start_time = datetime.now()
        logger.info("🚀 Starting code generation process")
        
        try:
            description = input_data.get("description", "")
            language = input_data.get("language", "python").lower()
            framework = input_data.get("framework", "")
            complexity = input_data.get("complexity", "medium")
            include_tests = input_data.get("include_tests", True)
            
            logger.info(f"📋 Input parameters: language={language}, framework={framework}, complexity={complexity}, include_tests={include_tests}")
            logger.info(f"📝 Description length: {len(description)} characters")
            
            if not description:
                logger.warning("❌ No description provided")
                return AgentOutput.from_dict({
                    "generated_code": {},
                    "test_files": {},
                    "documentation": "",
                    "setup_instructions": "",
                    "api_docs": "",
                    "status": "error",
                    "error": "No description provided for code generation",
                    "agent": self.name
                })

            # Validate language support
            if language not in self.supported_languages:
                logger.warning(f"❌ Unsupported language: {language}")
                return AgentOutput.from_dict({
                    "generated_code": {},
                    "test_files": {},
                    "documentation": "",
                    "setup_instructions": "",
                    "api_docs": "",
                    "status": "error",
                    "error": f"Unsupported language: {language}. Supported: {list(self.supported_languages.keys())}",
                    "agent": self.name
                })

            logger.info("✅ Input validation passed")

            # Generate code architecture
            logger.info("🏗️ Step 1: Generating architecture...")
            arch_start = datetime.now()
            architecture = self._generate_architecture(description, language, framework, complexity)
            arch_time = (datetime.now() - arch_start).total_seconds()
            logger.info(f"✅ Architecture generated in {arch_time:.2f} seconds")
            
            # Generate main code files
            logger.info("💻 Step 2: Generating code files...")
            code_start = datetime.now()
            generated_code = self._generate_code_files(description, language, framework, architecture)
            code_time = (datetime.now() - code_start).total_seconds()
            logger.info(f"✅ Code files generated in {code_time:.2f} seconds ({len(generated_code)} files)")
            
            # Generate test files if requested
            test_files = {}
            if include_tests:
                logger.info("🧪 Step 3: Generating test files...")
                test_start = datetime.now()
                test_files = self._generate_test_files(generated_code, language, architecture)
                test_time = (datetime.now() - test_start).total_seconds()
                logger.info(f"✅ Test files generated in {test_time:.2f} seconds ({len(test_files)} files)")
            else:
                logger.info("⏭️ Step 3: Skipping test generation (not requested)")
            
            # Generate documentation
            logger.info("📚 Step 4: Generating documentation...")
            doc_start = datetime.now()
            documentation = self._generate_documentation(description, language, framework, architecture)
            doc_time = (datetime.now() - doc_start).total_seconds()
            logger.info(f"✅ Documentation generated in {doc_time:.2f} seconds")
            
            # Generate setup instructions
            logger.info("⚙️ Step 5: Generating setup instructions...")
            setup_start = datetime.now()
            setup_instructions = self._generate_setup_instructions(language, framework, architecture)
            setup_time = (datetime.now() - setup_start).total_seconds()
            logger.info(f"✅ Setup instructions generated in {setup_time:.2f} seconds")
            
            # Generate API documentation if applicable
            logger.info("📖 Step 6: Generating API documentation...")
            api_start = datetime.now()
            api_docs = self._generate_api_documentation(generated_code, language, architecture)
            api_time = (datetime.now() - api_start).total_seconds()
            logger.info(f"✅ API documentation generated in {api_time:.2f} seconds")

            total_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"🎉 Code generation completed successfully in {total_time:.2f} seconds")
            logger.info(f"⏱️ Time breakdown: arch={arch_time:.1f}s, code={code_time:.1f}s, tests={test_time if include_tests else 0:.1f}s, docs={doc_time:.1f}s, setup={setup_time:.1f}s, api={api_time:.1f}s")

            return AgentOutput.from_dict({
                "generated_code": generated_code,
                "test_files": test_files,
                "documentation": documentation,
                "setup_instructions": setup_instructions,
                "api_docs": api_docs,
                "architecture": architecture,
                "language": language,
                "framework": framework,
                "status": "completed",
                "agent": self.name
            })

        except Exception as e:
            total_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"💥 Code generation failed after {total_time:.2f} seconds: {str(e)}")
            return AgentOutput.from_dict({
                "generated_code": {},
                "test_files": {},
                "documentation": "",
                "setup_instructions": "",
                "api_docs": "",
                "status": "error",
                "error": str(e),
                "agent": self.name
            })

    def _generate_architecture(self, description: str, language: str, framework: str, complexity: str) -> Dict[str, Any]:
        """Generate code architecture and structure"""
        logger.info("🏗️ Calling OpenAI API for architecture generation...")
        api_start = datetime.now()
        
        try:
            prompt = f"""
You are a senior software architect. Design a clean, modular architecture for the following requirement:

Description: {description}
Language: {language}
Framework: {framework}
Complexity: {complexity}

Provide a JSON response with:
1. project_structure: List of files/directories to create
2. main_components: Key classes/modules and their responsibilities
3. design_patterns: Recommended patterns to use
4. dependencies: Required libraries/packages
5. security_considerations: Security best practices to implement
6. performance_optimizations: Performance considerations
7. testing_strategy: Testing approach and coverage areas

Focus on:
- Clean architecture principles
- SOLID principles
- Separation of concerns
- Error handling strategy
- Input validation approach
- Scalability considerations

Return only valid JSON.
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1500
            )

            api_time = (datetime.now() - api_start).total_seconds()
            logger.info(f"✅ OpenAI API call completed in {api_time:.2f} seconds")

            try:
                architecture = json.loads(response.choices[0].message.content)
                logger.info("✅ Architecture JSON parsed successfully")
                return architecture
            except json.JSONDecodeError:
                logger.warning("⚠️ Failed to parse architecture JSON, using fallback")
                return self._get_fallback_architecture(language, complexity)

        except Exception as e:
            api_time = (datetime.now() - api_start).total_seconds()
            logger.error(f"❌ Architecture generation failed after {api_time:.2f} seconds: {str(e)}")
            return self._get_fallback_architecture(language, complexity)

    def _generate_code_files(self, description: str, language: str, framework: str, architecture: Dict[str, Any]) -> Dict[str, str]:
        """Generate main code files"""
        logger.info("💻 Starting code file generation...")
        code_files = {}
        
        try:
            # Get file structure from architecture
            project_structure = architecture.get('project_structure', [])
            main_components = architecture.get('main_components', {})
            
            logger.info(f"📁 Project structure: {len(project_structure)} files to generate")

            for i, file_path in enumerate(project_structure):
                if self._is_code_file(file_path, language):
                    logger.info(f"📄 Generating file {i+1}/{len(project_structure)}: {file_path}")
                    file_start = datetime.now()
                    
                    code_content = self._generate_single_file(
                        file_path, description, language, framework, architecture
                    )
                    
                    file_time = (datetime.now() - file_start).total_seconds()
                    logger.info(f"✅ File {file_path} generated in {file_time:.2f} seconds ({len(code_content)} chars)")
                    
                    code_files[file_path] = code_content

            # Ensure we have at least a main file
            if not code_files:
                logger.warning("⚠️ No code files generated, creating fallback main file")
                main_file = f"main{self.supported_languages[language]['ext']}"
                code_files[main_file] = self._generate_main_file(description, language, framework)

        except Exception as e:
            logger.error(f"❌ Code file generation error: {str(e)}")
            # Fallback: generate a simple main file
            main_file = f"main{self.supported_languages[language]['ext']}"
            code_files[main_file] = self._generate_fallback_code(description, language)

        logger.info(f"✅ Code file generation completed: {len(code_files)} files")
        return code_files

    def _generate_single_file(self, file_path: str, description: str, language: str, framework: str, architecture: Dict[str, Any]) -> str:
        """Generate code for a single file"""
        logger.info(f"🔧 Generating content for {file_path}...")
        api_start = datetime.now()
        
        try:
            prompt = f"""
Generate clean, well-documented {language} code for the file: {file_path}

Project Description: {description}
Framework: {framework}
Architecture: {json.dumps(architecture, indent=2)}

Requirements:
1. Follow {language} best practices and conventions
2. Include comprehensive error handling
3. Add input validation where appropriate
4. Use proper design patterns from architecture
5. Include detailed docstrings/comments
6. Implement security best practices
7. Optimize for performance and maintainability
8. Follow SOLID principles
9. Include type hints/annotations where applicable
10. Handle edge cases gracefully

File Purpose: Based on the file path and architecture, determine the specific responsibility of this file.

Generate only the code content, no explanations.
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=2000
            )

            api_time = (datetime.now() - api_start).total_seconds()
            logger.info(f"✅ OpenAI API call for {file_path} completed in {api_time:.2f} seconds")

            return response.choices[0].message.content.strip()

        except Exception as e:
            api_time = (datetime.now() - api_start).total_seconds()
            logger.error(f"❌ Single file generation failed for {file_path} after {api_time:.2f} seconds: {str(e)}")
            return f"# Error generating code for {file_path}: {str(e)}\n# TODO: Implement {file_path}"

    def _generate_test_files(self, code_files: Dict[str, str], language: str, architecture: Dict[str, Any]) -> Dict[str, str]:
        """Generate comprehensive test files"""
        logger.info("🧪 Starting test file generation...")
        test_files = {}
        test_framework = self.supported_languages[language]['test_framework']
        
        try:
            test_count = 0
            for file_path, code_content in code_files.items():
                if self._should_generate_tests(file_path):
                    test_count += 1
                    logger.info(f"🧪 Generating test {test_count} for {file_path}")
                    test_start = datetime.now()
                    
                    test_file_path = self._get_test_file_path(file_path, language)
                    test_content = self._generate_test_content(
                        file_path, code_content, language, test_framework, architecture
                    )
                    
                    test_time = (datetime.now() - test_start).total_seconds()
                    logger.info(f"✅ Test for {file_path} generated in {test_time:.2f} seconds")
                    
                    test_files[test_file_path] = test_content

        except Exception as e:
            logger.error(f"❌ Test file generation error: {str(e)}")
            # Generate basic test file
            test_files[f"test_main{self.supported_languages[language]['ext']}"] = self._generate_basic_test(language, test_framework)

        logger.info(f"✅ Test file generation completed: {len(test_files)} test files")
        return test_files

    def _generate_test_content(self, file_path: str, code_content: str, language: str, test_framework: str, architecture: Dict[str, Any]) -> str:
        """Generate test content for a specific file"""
        logger.info(f"🧪 Calling OpenAI API for test generation: {file_path}")
        api_start = datetime.now()
        
        try:
            prompt = f"""
Generate comprehensive unit tests for the following {language} code using {test_framework}:

File: {file_path}
Code:
{code_content}

Testing Strategy: {architecture.get('testing_strategy', 'Standard unit testing')}

Requirements:
1. Test all public methods/functions
2. Test edge cases and error conditions
3. Test input validation
4. Mock external dependencies
5. Achieve high code coverage
6. Include integration tests where appropriate
7. Test security validations
8. Test performance-critical paths
9. Use descriptive test names
10. Include setup and teardown methods

Generate only the test code, no explanations.
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=2000
            )

            api_time = (datetime.now() - api_start).total_seconds()
            logger.info(f"✅ OpenAI API call for test {file_path} completed in {api_time:.2f} seconds")

            return response.choices[0].message.content.strip()

        except Exception as e:
            api_time = (datetime.now() - api_start).total_seconds()
            logger.error(f"❌ Test generation failed for {file_path} after {api_time:.2f} seconds: {str(e)}")
            return f"# Error generating tests for {file_path}: {str(e)}\n# TODO: Implement tests"

    def _generate_documentation(self, description: str, language: str, framework: str, architecture: Dict[str, Any]) -> str:
        """Generate comprehensive documentation"""
        logger.info("📚 Calling OpenAI API for documentation generation...")
        api_start = datetime.now()
        
        try:
            prompt = f"""
Generate comprehensive documentation for a {language} project:

Description: {description}
Framework: {framework}
Architecture: {json.dumps(architecture, indent=2)}

Include:
1. Project overview and purpose
2. Architecture explanation
3. Setup and installation instructions
4. Usage examples with code snippets
5. API reference (if applicable)
6. Configuration options
7. Troubleshooting guide
8. Contributing guidelines
9. Security considerations
10. Performance optimization tips
11. Deployment instructions
12. Changelog template

Format as Markdown with proper headings and code blocks.
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=2000
            )

            api_time = (datetime.now() - api_start).total_seconds()
            logger.info(f"✅ OpenAI API call for documentation completed in {api_time:.2f} seconds")

            return response.choices[0].message.content.strip()

        except Exception as e:
            api_time = (datetime.now() - api_start).total_seconds()
            logger.error(f"❌ Documentation generation failed after {api_time:.2f} seconds: {str(e)}")
            return self._generate_basic_documentation(description, language, framework)

    def _generate_setup_instructions(self, language: str, framework: str, architecture: Dict[str, Any]) -> str:
        """Generate detailed setup instructions"""
        logger.info("⚙️ Calling OpenAI API for setup instructions...")
        api_start = datetime.now()
        
        try:
            dependencies = architecture.get('dependencies', [])
            
            prompt = f"""
Generate detailed setup instructions for a {language} project:

Framework: {framework}
Dependencies: {dependencies}

Include:
1. Prerequisites and system requirements
2. Installation steps (step-by-step)
3. Environment setup
4. Dependency installation commands
5. Configuration file setup
6. Database setup (if applicable)
7. Environment variables
8. Running the application
9. Running tests
10. Building for production
11. Docker setup (if applicable)
12. Troubleshooting common issues

Format as clear, numbered steps with code examples.
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=1500
            )

            api_time = (datetime.now() - api_start).total_seconds()
            logger.info(f"✅ OpenAI API call for setup instructions completed in {api_time:.2f} seconds")

            return response.choices[0].message.content.strip()

        except Exception as e:
            api_time = (datetime.now() - api_start).total_seconds()
            logger.error(f"❌ Setup instructions generation failed after {api_time:.2f} seconds: {str(e)}")
            return self._generate_basic_setup_instructions(language, framework)

    def _generate_api_documentation(self, code_files: Dict[str, str], language: str, architecture: Dict[str, Any]) -> str:
        """Generate API documentation if applicable"""
        logger.info("📖 Checking if API documentation is needed...")
        
        try:
            # Check if this appears to be an API project
            has_api = any(
                'api' in file_path.lower() or 'endpoint' in file_path.lower() or 'route' in file_path.lower()
                for file_path in code_files.keys()
            )
            
            if not has_api:
                logger.info("⏭️ No API detected, skipping API documentation")
                return ""

            logger.info("📖 Calling OpenAI API for API documentation...")
            api_start = datetime.now()

            prompt = f"""
Generate API documentation for the following {language} code:

Code Files:
{json.dumps({k: v[:500] + "..." if len(v) > 500 else v for k, v in code_files.items()}, indent=2)}

Include:
1. API overview
2. Authentication (if applicable)
3. Base URL and versioning
4. Endpoint documentation with:
   - HTTP method
   - URL path
   - Parameters
   - Request body schema
   - Response schema
   - Status codes
   - Example requests/responses
5. Error handling
6. Rate limiting (if applicable)
7. SDK/client examples

Format as Markdown with proper structure.
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=1500
            )

            api_time = (datetime.now() - api_start).total_seconds()
            logger.info(f"✅ OpenAI API call for API documentation completed in {api_time:.2f} seconds")

            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"❌ API documentation generation failed: {str(e)}")
            return ""

    def _get_fallback_architecture(self, language: str, complexity: str) -> Dict[str, Any]:
        """Provide fallback architecture when AI generation fails"""
        logger.info(f"🔄 Using fallback architecture for {language} ({complexity})")
        ext = self.supported_languages[language]['ext']
        
        if complexity == "simple":
            structure = [f"main{ext}", f"utils{ext}"]
        elif complexity == "complex":
            structure = [
                f"main{ext}",
                f"models{ext}",
                f"services{ext}",
                f"controllers{ext}",
                f"utils{ext}",
                f"config{ext}"
            ]
        else:  # medium
            structure = [f"main{ext}", f"models{ext}", f"services{ext}", f"utils{ext}"]

        return {
            "project_structure": structure,
            "main_components": {
                "main": "Application entry point",
                "models": "Data models and schemas",
                "services": "Business logic",
                "utils": "Utility functions"
            },
            "design_patterns": ["MVC", "Repository"],
            "dependencies": [],
            "security_considerations": ["Input validation", "Error handling"],
            "performance_optimizations": ["Caching", "Lazy loading"],
            "testing_strategy": "Unit tests with mocking"
        }

    def _is_code_file(self, file_path: str, language: str) -> bool:
        """Check if file path represents a code file"""
        ext = self.supported_languages[language]['ext']
        return file_path.endswith(ext) and not file_path.startswith('test_')

    def _should_generate_tests(self, file_path: str) -> bool:
        """Determine if tests should be generated for this file"""
        return not any(skip in file_path.lower() for skip in ['config', 'constant', '__init__'])

    def _get_test_file_path(self, file_path: str, language: str) -> str:
        """Generate test file path from source file path"""
        ext = self.supported_languages[language]['ext']
        base_name = file_path.replace(ext, '')
        return f"test_{base_name}{ext}"

    def _generate_main_file(self, description: str, language: str, framework: str) -> str:
        """Generate a main application file"""
        logger.info("📄 Generating main file...")
        api_start = datetime.now()
        
        try:
            prompt = f"""
Generate a main application file in {language} for: {description}

Framework: {framework}

Requirements:
1. Clean, production-ready code
2. Proper error handling
3. Input validation
4. Logging setup
5. Configuration management
6. Entry point with proper structure
7. Documentation and comments
8. Security best practices

Generate only the code, no explanations.
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=1500
            )

            api_time = (datetime.now() - api_start).total_seconds()
            logger.info(f"✅ Main file generated in {api_time:.2f} seconds")

            return response.choices[0].message.content.strip()

        except Exception as e:
            api_time = (datetime.now() - api_start).total_seconds()
            logger.error(f"❌ Main file generation failed after {api_time:.2f} seconds: {str(e)}")
            return self._generate_fallback_code(description, language)

    def _generate_fallback_code(self, description: str, language: str) -> str:
        """Generate basic fallback code when AI generation fails"""
        logger.info(f"🔄 Generating fallback code for {language}")
        
        if language == "python":
            return f'''"""
{description}

This is a basic implementation generated as fallback.
TODO: Enhance with proper implementation.
"""

import logging
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Application:
    """Main application class for {description}"""
    
    def __init__(self):
        """Initialize the application"""
        self.config = self._load_config()
        logger.info("Application initialized")
    
    def _load_config(self) -> Dict[str, Any]:
        """Load application configuration"""
        return {{
            "debug": False,
            "version": "1.0.0"
        }}
    
    def run(self) -> None:
        """Run the main application logic"""
        try:
            logger.info("Starting application")
            # TODO: Implement main logic here
            print("Application running successfully!")
        except Exception as e:
            logger.error(f"Application error: {{e}}")
            raise

def main():
    """Application entry point"""
    try:
        app = Application()
        app.run()
    except Exception as e:
        logger.error(f"Failed to start application: {{e}}")
        return 1
    return 0

if __name__ == "__main__":
    exit(main())
'''
        else:
            return f"// {description}\n// TODO: Implement in {language}"

    def _generate_basic_test(self, language: str, test_framework: str) -> str:
        """Generate basic test file when AI generation fails"""
        logger.info(f"🔄 Generating basic test for {language}")
        
        if language == "python" and test_framework == "pytest":
            return '''"""
Basic test file for the application.
TODO: Add comprehensive tests.
"""

import pytest
from main import Application

class TestApplication:
    """Test cases for the main Application class"""
    
    def setup_method(self):
        """Set up test fixtures before each test method"""
        self.app = Application()
    
    def test_application_initialization(self):
        """Test that application initializes correctly"""
        assert self.app is not None
        assert self.app.config is not None
    
    def test_config_loading(self):
        """Test configuration loading"""
        config = self.app._load_config()
        assert isinstance(config, dict)
        assert "version" in config
    
    def test_application_run(self):
        """Test application run method"""
        # TODO: Add proper test implementation
        try:
            self.app.run()
        except Exception as e:
            pytest.fail(f"Application run failed: {e}")
'''
        else:
            return f"// Basic test file for {language} using {test_framework}\n// TODO: Implement tests"

    def _generate_basic_documentation(self, description: str, language: str, framework: str) -> str:
        """Generate basic documentation when AI generation fails"""
        logger.info("🔄 Generating basic documentation")
        
        return f"""# {description}

## Overview
This project implements {description} using {language}.

## Framework
- **Language**: {language}
- **Framework**: {framework}

## Setup
1. Install dependencies
2. Configure environment
3. Run the application

## Usage
TODO: Add usage instructions

## Testing
Run tests using the appropriate test framework.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

## License
TODO: Add license information
"""

    def _generate_basic_setup_instructions(self, language: str, framework: str) -> str:
        """Generate basic setup instructions when AI generation fails"""
        logger.info("🔄 Generating basic setup instructions")
        
        if language == "python":
            return """# Setup Instructions

## Prerequisites
- Python 3.8 or higher
- pip package manager

## Installation
1. Clone the repository
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application
```bash
python main.py
```

## Running Tests
```bash
pytest
```

## Configuration
Create a `.env` file with necessary environment variables.
"""
        else:
            return f"# Setup Instructions for {language}\n\nTODO: Add specific setup instructions for {language} and {framework}"