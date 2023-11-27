################################################################################
#
# lanplay server manager
#
################################################################################

LANPLAY_SERVER_MGR_VERSION = 0.0.1
#LANPLAY_SERVER_MGR_SITE_METHOD = local
#LANPLAY_SERVER_MGR_SITE = $(TOPDIR)/package/lanplay-server-mgr/src
LANPLAY_SERVER_MGR_SITE = https://github.com/Ken-u/simple_lanplay_server_mgr/archive/refs/tags
LANPLAY_SERVER_MGR_SOURCE = v$(LANPLAY_SERVER_MGR_VERSION).tar.gz
LANPLAY_SERVER_MGR_INSTALL_STAGING = YES
LANPLAY_SERVER_MGR_LICENSE = GPL-3.0
LANPLAY_SERVER_MGR_LICENSE_FILES = COPYING
LANPLAY_SERVER_MGR_CFLAGS = $(TARGET_CFLAGS)
LANPLAY_SERVER_MGR_LDFLAGS = $(TARGET_LDFLAGS) $(TARGET_NLS_LIBS)
LANPLAY_SERVER_MGR_CONF_ENV = \
	CFLAGS="$(LANPLAY_SERVER_MGR_CFLAGS)" \
	LDFLAGS="$(LANPLAY_SERVER_MGR_LDFLAGS)"

define LANPLAY_SERVER_MGR_INSTALL_INIT_SYSV
	$(INSTALL) -m 0755 -D package/lanplay-server-mgr/S95_lanplay_server_mgr \
		$(TARGET_DIR)/etc/init.d/S95_lanplay_server_mgr
	mkdir -p $(TARGET_DIR)/usr/lanplay_server/; \
		cp -rf package/lanplay-server-mgr/server_list.txt \
		$(TARGET_DIR)/usr/lanplay_server/
endef

$(eval $(cmake-package))
