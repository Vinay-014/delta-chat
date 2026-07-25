from setuptools import setup, find_packages

setup(
    name="pathnovo-delta-chat",
    version="1.0.0",
    description="P&ID Document Revision Delta & Grounded Chat System",
    author="PathNovo AI Engineering",
    packages=find_packages(),
    python_requires=">=3.11",
    install_requires=[
        "fastapi>=0.110.0",
        "pydantic>=2.6.0",
        "uvicorn>=0.28.0",
        "jinja2>=3.1.3",
    ],
)
