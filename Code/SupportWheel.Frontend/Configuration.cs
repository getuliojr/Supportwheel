using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SupportWheel.Frontend
{
  public class Configuration
  {
    // MSBuild has a bug where if no source files are found, the build fails when
    // running from the commandline (or in our case, TeamCity). This file is only here
    // to allow the build to complete.
  }
}
