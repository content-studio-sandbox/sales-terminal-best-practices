
[root@alpo-paca1 ~]# chmod +x cognos_debug.sh
[root@alpo-paca1 ~]# sudo ./cognos_debug.sh > cognos_diagnostic_report.txt 2>&1
[root@alpo-paca1 ~]# cat cognos_diagnostic_report.txt
==========================================
Cognos Environment Diagnostic Tool
==========================================


==========================================
1. COGNOS INSTALLATION LOCATION
==========================================

Found Cognos directory: /opt/ibm/cognos

==========================================
2. COGNOS VERSION INFORMATION
==========================================


==========================================
3. COGNOS PROCESS STATUS
==========================================

Checking for running Cognos processes:
root       62254  0.0  0.0 346488  7760 pts/0    S+   11:53   0:00 sudo ./cognos_debug.sh
root       62256  0.0  0.0 222604  3060 pts/0    S+   11:53   0:00 /bin/bash ./cognos_debug.sh

Checking for Java processes (Cognos runs on Java):

==========================================
4. COGNOS SERVICES STATUS
==========================================

Checking systemd services:
No Cognos systemd services found

Checking init.d services:
No Cognos init.d services found

==========================================
5. COGNOS LOG FILES
==========================================

Log directory found: /opt/ibm/cognos/analytics/logs
Recent log files:
total 2.9M
-rw-r--r-- 1 root root 2.0K Dec 11 17:51 cbs_run_WebSphereLiberty.log
-rw-r--r-- 1 root root 7.9K Dec 11 17:51 dq_messages.log
-rw-r--r-- 1 root root 200K Dec 11 17:51 p2pd_messages.log
-rw-r--r-- 1 root root  75K Dec 11 17:51 cognosserver.log
-rw-r--r-- 1 root root 7.5K Dec 11 17:51 cogaudit.log
-rw-r--r-- 1 root root  26K Dec 11 17:51 dataset-service.log
-rw-r--r-- 1 root root  42K Dec 11 17:51 flint-console.log
-rw-r--r-- 1 root root 3.3K Dec 11 17:50 cmMetrics_2025-12-11.log
-rw-r--r-- 1 root root 8.6K Dec 11 08:50 cmMetrics_2025-12-10.log


==========================================
6. RECENT ERRORS IN LOGS (Last 50 lines)
==========================================

Checking logs in: /opt/ibm/cognos/analytics/logs

==========================================
7. SYSTEM RESOURCES
==========================================

Memory Usage:
              total        used        free      shared  buff/cache   available
Mem:           31Gi       1.8Gi        27Gi        64Mi       1.8Gi        28Gi
Swap:          15Gi          0B        15Gi

Disk Space:
Filesystem             Size  Used Avail Use% Mounted on
tmpfs                   16G  4.0K   16G   1% /dev/shm
/dev/mapper/rhel-root  233G   62G  171G  27% /
/dev/vda1             1014M  251M  764M  25% /boot

CPU Load:
 11:53:15 up 1 day,  2:51,  1 user,  load average: 0.05, 0.02, 0.00

Top Memory Consuming Processes:
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         853  1.5  2.4 3010964 792680 ?      Sl   Jan05  25:02 falcon-sensor-bpf
db2inst1    2463  0.2  1.0 2191412 327972 ?      Sl   Jan05   3:24 db2sysc 0
root        2460  0.0  0.7 1553796 248896 ?      Sl   Jan05   0:00 db2wdog 0 [db2inst1]
gdm         1786  0.1  0.6 4636544 226104 tty1   Sl+  Jan05   1:46 /usr/bin/gnome-shell
root        2469  0.0  0.4 1553360 151904 ?      S    Jan05   0:00 db2ckpwd 0
root        2470  0.0  0.4 1553360 151904 ?      S    Jan05   0:00 db2ckpwd 0
root        2471  0.0  0.4 1553360 151904 ?      S    Jan05   0:00 db2ckpwd 0
db2inst1    2473  0.0  0.3 720460 109808 ?       S    Jan05   0:00 db2vend (PD Vendor Process - 1) 0
db2inst1    2482  0.0  0.1 931364 57336 ?        Sl   Jan05   1:33 db2acd 0 ,0,0,0,1,0,0,00000000,0,0,0000000000000000,0000000000000000,00000000,00000000,00000000,00000000,00000000,00000000,0004,0000000f,00000000,00000000,00000000,00000000,00000000,00000000,00000000,0000000400000000,0000000000000000,0000000000000000,1,0,0,,,,,a89c10,14,1e014,2,0,1,0000000000041fc0,0x240000000,0x240000000,1600000,8,2,1e

==========================================
8. NETWORK PORTS (Cognos typically uses 9300, 9080, 9443)
==========================================

Listening ports related to Cognos:
tcp6       0      0 :::9090                 :::*                    LISTEN      1/systemd

==========================================
9. COGNOS CONFIGURATION FILES
==========================================

Found config: /opt/ibm/cognos/analytics/configuration/cogstartup.xml
Last modified: 2024-05-07 09:48:09.564050672 -0500

==========================================
10. RECENT SYSTEM LOGS (for crashes/OOM)
==========================================

Checking /var/log/messages for Cognos-related issues:

==========================================
DIAGNOSTIC SUMMARY
==========================================

Cognos Home: /opt/ibm/cognos

Next Steps:
1. Review the log files in the locations shown above
2. Check for OutOfMemory errors or exceptions
3. Monitor system resources when Cognos is running
4. Review the configuration files for any misconfigurations

Common Issues:
- Insufficient memory (check Java heap settings)
- Port conflicts (check if ports 9300, 9080, 9443 are available)
- Database connection issues
- Certificate/SSL problems
- Disk space exhaustion

==========================================
Diagnostic complete!