/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 This source code is covered under the following license: http://vizuly.io/commercial-license/

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @version 1.0.35

// All paths except vizuly/core get their own namespace as denoted by the _path.js file


vizuly.component = {};

// Various layout enumerations implement by vizuly components
vizuly.component.layout = {};
vizuly.component.layout.CLUSTERED = "CLUSTERED";
vizuly.component.layout.STACKED = "STACKED";
vizuly.component.layout.OVERLAP = "OVERLAP";
vizuly.component.layout.STREAM = "STREAM";